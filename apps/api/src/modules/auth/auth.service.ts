// apps/api/src/modules/auth/auth.service.ts
import { TonProofPayload } from '@mint/types';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { HeroGamingApiRoutes } from 'src/shared/hero-gaming-api-routes';
import { HeroGamingClient } from 'src/shared/hero-gaming.client';
import { SessionService } from '../session/session.service';
import { TonPurchaseService } from '../transaction/ton-purchase.service';
import { TelegramAuthDto, TonLoginDto, TonProofDetails } from './auth.dto';
import { User } from './auth.types';
import { errorHandler } from './lib/fn-errors';
import { generateNonce, generateUserData, hashNonce } from './lib/fn-generators';
import { getTgUserPic } from './lib/fn-telegram';
import { extractClientType, extractIpAddress, isDurationElapsed, isValidTelegramHash, validateTonSignature } from './lib/fn-validators';

const nonceStorage: Map<string, string> = new Map();
@Injectable()
export class AuthService {
  private readonly telegramBotToken: string;

  constructor(
    private readonly hg: HeroGamingClient,
    private readonly sessionService: SessionService,
    private readonly tonPurchaseService: TonPurchaseService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    this.telegramBotToken = process.env.TELEGRAM_BOT_TOKEN || '';
    if (!this.telegramBotToken) {
      console.warn('TELEGRAM_BOT_TOKEN is not set. Telegram authentication will not work.');
    }
  }

  /** generate & store a random nonce for this wallet */
  async getNewNonce(wallet: string): Promise<string> {
    const nonce = generateNonce();

    // Hash the nonce using TELEGRAM_BOT_TOKEN as the key
    const hashedNonce = hashNonce(nonce, this.telegramBotToken);

    // Store the hashed nonce locally instead of using WalletAddressesService
    nonceStorage.set(wallet, hashedNonce);

    return await Promise.resolve(nonce);
  }

  /**
   * Validation rules:
   * 1. The stored nonce for this wallet must exist
   * 2. The nonce in the payload must match the stored nonce
   * 3. The proof.payload must match the stored nonce
   */
  async tonLogin(dto: TonLoginDto): Promise<User> {
    const { wallet, proof } = dto.tonProof;
    const referralId = dto.referralId;
    const referrer = dto.referrer;
    const walletAddress = wallet.address;

    // Validate the TON proof
    await this.validateTonProof(wallet, proof); // temporarly

    // Generate a deterministic ID based on the wallet address
    const { username } = generateUserData(walletAddress.slice(-5), {
      prefix: 'minter_',
    });
    const wallet_address = {
      wallet_address: walletAddress,
      external_data: {
        username,
      },
    };

    // Call the TON auth endpoint via SessionService
    const sessionData = await this.sessionService.tonWalletSession(wallet_address, referralId, referrer);
    if (!sessionData?.token) {
      throw new UnauthorizedException('Error: No Session Token were found');
    }

    // Link player to wallet if player data is available
    if (sessionData?.player?.mapsPlayerId) {
      try {
        await this.tonPurchaseService.linkPlayerToWallet(walletAddress, sessionData.player.mapsPlayerId);
        console.log(`Successfully linked player ${sessionData.player.mapsPlayerId} to wallet ${walletAddress}`);
      } catch (linkError) {
        console.error('Failed to link player to wallet during TON auth:', linkError);
        // Don't throw error here as authentication was successful
      }
    }

    return {
      id: username,
      wallet: [walletAddress],
      username: username || sessionData?.player?.username,
      token: sessionData?.token,
      player: sessionData?.player,
    };
  }

  /**
   * Authenticate a user via Telegram
   * @param dto - The Telegram authentication data
   * @returns User data after successful authentication
   */
  async authenticateTelegram(dto: TelegramAuthDto): Promise<User> {
    const { initData, referralId, referrer } = dto;

    // Verify the Telegram data
    const isValidTGUser = isValidTelegramHash(initData, this.telegramBotToken);
    if (!isValidTGUser?.id) {
      throw new UnauthorizedException('Invalid Telegram authentication data');
    }

    // Generate a deterministic user slug from the Telegram ID
    const { username } = generateUserData(isValidTGUser.id, {
      prefix: 'tg_',
      maxLength: 16,
    });

    // Extract IP address and client type from request
    const ipAddress = extractIpAddress(this.request);
    const clientType = extractClientType(this.request);
    const tgUserPic = await getTgUserPic(isValidTGUser.id!);


    const telegramRegisterPayload: Record<string, any> = {
      username: username,
      country_code: process.env.HEROGAMING_FRONTEND_COUNTRY_CODE || 'GB',
      ip_address: ipAddress,
      client_type: clientType,
      avatar_image_url: tgUserPic,
      referred_by_id: referralId?.trim() || undefined,
      request_referrer: referrer?.trim() || undefined,
    };

    // Call the new telegram_auth endpoint
    const telegramAuthResponse = await this.hg.vx
      .post<{ session_token: string; errors?: string[][] }>(
        HeroGamingApiRoutes.mint.telegramAuth,
        telegramRegisterPayload,
        {
          Authorization: `Basic ${process.env.HEROGAMING_MINT_API_TOKEN}`,
          basicAuth: true,
        },
      )
      .catch((err) => errorHandler(err, 'Hero Gaming API telegram auth failed'));

    if (telegramAuthResponse?.errors) {
      throw new UnauthorizedException(telegramAuthResponse?.errors[0].join(' '));
    }

    // Validate the session token and get player info
    const sessionValidation = await this.sessionService.validateSession(telegramAuthResponse.session_token);
    if (!sessionValidation) {
      throw new UnauthorizedException('Failed to validate session token');
    }

    // Note: For Telegram auth, we don't have a wallet address to link to
    // The wallet linking will happen when the user connects their TON wallet later
    // This is handled in the frontend when the user authenticates with TON

    return {
      id: String(isValidTGUser.id),
      username: username || sessionValidation.player?.username || '',
      token: telegramAuthResponse.session_token,
      player: sessionValidation.player,
    };
  }

  /**
   * Validates TON proof including nonce verification, expiration check, and cleanup
   * @param walletAddress - The wallet address to validate
   * @param nonce - The nonce from the request
   * @param proof - The proof object containing payload and timestamp
   */
  private async validateTonProof(wallet: TonProofPayload['wallet'], proof: TonProofDetails): Promise<void> {
    // Get the stored hashed nonce for this wallet
    const storedHashedNonce = nonceStorage.get(wallet?.address);

    if (!storedHashedNonce) {
      throw new UnauthorizedException(`TON proof validation failed: No nonce found for wallet ${wallet?.address}`);
    }

    // Hash the incoming nonce and compare with stored hash
    const incomingHashedNonce = hashNonce(proof?.payload, this.telegramBotToken);
    const incomingProofHashedNonce = hashNonce(proof.payload, this.telegramBotToken);

    const isNonceMismatch = incomingHashedNonce !== storedHashedNonce;
    const isProofMismatch = incomingProofHashedNonce !== storedHashedNonce;

    if (isNonceMismatch || isProofMismatch) {
      throw new UnauthorizedException(
        `TON proof validation failed | stored hash: ${storedHashedNonce} | incoming nonce hash: ${incomingHashedNonce} | isNonceMismatch=${isNonceMismatch} | isProofMismatch=${isProofMismatch}`,
      );
    }

    // Check if the proof has expired 5 seconds ago
    if (isDurationElapsed(proof.timestamp, 5000)) {
      throw new UnauthorizedException('TON proof has expired');
    }

    // Check the proof Signature
    const account = { address: wallet.address, publicKey: wallet.publicKey };
    const { ok } = validateTonSignature({ proof, account });
    if (!ok) {
      throw new UnauthorizedException('TON proof validation failed: Invalid signature');
    }

    // Remove the used nonce after successful verification
    nonceStorage.delete(wallet?.address);
    return await Promise.resolve();
  }
}
