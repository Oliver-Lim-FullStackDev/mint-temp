import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateStarsPurchaseDto {
  @ApiProperty({ description: 'Store item ID to purchase' })
  @IsString()
  itemId: string;

  @ApiProperty({ description: 'Amount in Stars' })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Transaction ID from the Stars payment' })
  @IsString()
  transactionId: string;

  @ApiProperty({ description: 'Username of the user making the purchase' })
  @IsString()
  username: string;

  @ApiPropertyOptional({ description: 'Player ID from Hero Gaming (optional)' })
  @IsOptional()
  @IsString()
  playerId?: string;
}

export class StarsPurchaseResponseDto {
  @ApiProperty({ description: 'Whether the purchase was successful' })
  success: boolean;

  @ApiPropertyOptional({ description: 'Purchase ID' })
  purchaseId?: string;

  @ApiPropertyOptional({ description: 'Error message if purchase failed' })
  error?: string;
}
