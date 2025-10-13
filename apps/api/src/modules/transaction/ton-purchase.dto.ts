import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateTonPurchaseDto {
  @ApiProperty({ description: 'Store item ID to purchase' })
  @IsString()
  itemId: string;

  @ApiProperty({ description: 'TON wallet address making the purchase' })
  @IsString()
  walletAddress: string;

  @ApiProperty({ description: 'Amount in TON' })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Transaction ID from the TON blockchain' })
  @IsString()
  transactionId: string;

  @ApiPropertyOptional({ description: 'Player ID from Hero Gaming (optional)' })
  @IsOptional()
  @IsString()
  playerId?: string;

  @ApiProperty({ description: 'Username of the user making the purchase' })
  @IsString()
  username: string;
}

export class TonPurchaseResponseDto {
  @ApiProperty({ description: 'Whether the purchase was successful' })
  success: boolean;

  @ApiPropertyOptional({ description: 'Purchase ID' })
  purchaseId?: string;

  @ApiPropertyOptional({ description: 'Wallet address information' })
  walletAddress?: any;

  @ApiPropertyOptional({ description: 'Error message if purchase failed' })
  error?: string;
}

export class WalletInfoResponseDto {
  @ApiProperty({ description: 'Wallet address' })
  walletAddress: string;

  @ApiPropertyOptional({ description: 'Player ID linked to this wallet' })
  playerId?: string;

  @ApiPropertyOptional({ description: 'Number of purchases made' })
  purchaseCount?: number;

  @ApiPropertyOptional({ description: 'Total amount spent in TON' })
  totalSpent?: number;

  @ApiPropertyOptional({ description: 'Last purchase information' })
  lastPurchase?: {
    itemId: string;
    amount: number;
    transactionId: string;
    timestamp: string;
  };

  @ApiPropertyOptional({ description: 'First purchase timestamp' })
  firstPurchase?: string;
}

export class LinkPlayerDto {
  @ApiProperty({ description: 'TON wallet address' })
  @IsString()
  walletAddress: string;

  @ApiProperty({ description: 'Player ID from Hero Gaming' })
  @IsString()
  playerId: string;
}
