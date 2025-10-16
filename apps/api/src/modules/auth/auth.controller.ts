import { BadRequestException, Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { SessionService } from '../session';
import { TelegramAuthDto, TonLoginDto } from './auth.dto';
import { AuthMapper } from './auth.mapper';
import { AuthService } from './auth.service';
import { User } from './auth.types';

/**
 * Authentication controller for TON wallet and Telegram authentication
 *
 * TON Wallet Authentication flow:
 * 1. Client requests a nonce for a specific wallet address
 * 2. Server generates and stores a nonce associated with that wallet
 * 3. Client uses the nonce to request a TON proof from the wallet
 * 4. Wallet signs the proof with the nonce as payload
 * 5. Client sends the signed proof to the server
 * 6. Server validates the proof and returns user data
 *
 * Telegram Authentication flow:
 * 1. Client obtains initData from Telegram WebApp
 * 2. Client extracts username and hash from initData
 * 3. Client sends the username and hash to the server
 * 4. Server validates the hash using the bot token
 * 5. Server creates a user account and returns user data
 */
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly sessionService: SessionService,
  ) {}

  /**
   * Step 1: Generate a nonce for the specified wallet address
   *
   * @param wallet - The TON wallet address
   * @returns An object containing the generated nonce
   */
  @Get('nonce/:wallet')
  async getNonce(@Param('wallet') wallet: string): Promise<{ nonce: string }> {
    const nonce = await this.auth.getNewNonce(wallet);
    return { nonce };
  }

  /**
   * Step 2: Register a wallet using TON proof authentication
   *
   * Expected request body format:
   * {
   *   "tonProof": {
   *     "wallet": { "address": "EQA..." },
   *     "proof": {
   *       "timestamp": 1234567890,
   *       "domain": { "lengthBytes": 32, "value": "example.com" },
   *       "payload": "abc123",
   *       "signature": "te6c..."
   *     },
   *     "nonce": "abc123"
   *   }
   * }
   *
   * @param dto - The TON proof data transfer object
   * @returns User data after successful authentication
   */
  @Post('register')
  async register(@Body() dto: TonLoginDto): Promise<User> {
    const user = await this.auth.tonLogin(dto);
    return AuthMapper.fromApi(user);
  }

  /**
   * Authenticate a user via Telegram
   *
   * Expected request body format:
   * {
   *   "username": "telegram_username",
   *   "hash": "telegram_hash"
   * }
   *
   * @param dto - The Telegram authentication data
   * @returns User data after successful authentication
   */
  @Post('telegram')
  async authenticateTelegram(@Body() dto: TelegramAuthDto, @Res({ passthrough: true }) res: ExpressResponse): Promise<User> {
    const user = await this.auth.authenticateTelegram(dto);

    if (!user) {
      throw new Error('Failed to authenticate user with Telegram');
    }

    if (user.token) {
      this.sessionService.setSessionCookie(user.token, res);
    }

    return AuthMapper.fromApi(user);
  }

  /**
   * Verify Privy identity token and return Privy user object
   * Reads the identity token from cookie `privy-id-token` or header `privy-id-token`.
   */
  @Get('privy/verify')
  async verifyPrivy(@Req() req: ExpressRequest): Promise<any> {
    const idToken = req.cookies?.['privy-id-token'] || (req.headers['privy-id-token'] as string | undefined);
    
    if (!idToken) {
      throw new BadRequestException('Identity token is required');
    }

    const user = await this.auth.verifyPrivyToken(idToken);
    // TODO: Authentificate the user with Hero Gaming
    return user;
  }
}
