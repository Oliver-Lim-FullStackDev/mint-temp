// apps/api/src/modules/auth/auth.dto.ts
import { TonProofPayload } from '@mint/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

/**
 * Represents the domain information in a TON proof
 *
 * @property lengthBytes - Length of the domain in bytes
 * @property value - The domain value (e.g., 'example.com')
 */
class TonProofDomain {
  lengthBytes!: number;
  value!: string;
}

/**
 * Contains the details of the TON proof provided by the wallet
 *
 * @property timestamp - Unix timestamp when the proof was created
 * @property domain - Domain information for the proof
 * @property payload - Should match the nonce that was provided by the server
 * @property signature - Cryptographic signature from the wallet
 */
export class TonProofDetails {
  timestamp!: number;
  domain!: TonProofDomain;
  payload!: string;
  signature!: string;
}

/**
 * Wallet information in the TON proof
 *
 * @property address - The TON wallet address (e.g., 'EQA...')
 */
class TonProofWallet {
  address!: string;
}

/**
 * The complete TON proof payload structure
 *
 * @property wallet - Information about the wallet
 * @property proof - The proof details including signature
 * @property nonce - The original nonce that was fetched from the server
 */

/**
 * Data transfer object for TON proof authentication
 *
 * This is the expected format for the /auth/register endpoint.
 * The client should send this structure after obtaining a nonce
 * and getting the wallet to sign the proof.
 */
export class TonLoginDto {
  @IsObject()
  tonProof: TonProofPayload;

  /**
   * Optional referral id
   */
  @IsString()
  @IsOptional()
  referralId: string;

  /**
   * Optional referral id
   */
  @IsString()
  @IsOptional()
  referrer: string;
}

/**
 * DTO for Telegram authentication
 */
export class TelegramAuthDto {
  /**
   * Hash from Telegram initData
   */
  @IsString()
  initData: string;
  /**
   * Optional referral id belonging to a registered user
   */
  @ApiPropertyOptional({ description: 'User Referral ID' })
  @IsOptional()
  @IsString()
  referralId: string;
  /**
   * Optional referral partner code
   */
  @ApiPropertyOptional({ description: 'Referrer partner code' })
  @IsOptional()
  @IsString()
  referrer?: string;
}
