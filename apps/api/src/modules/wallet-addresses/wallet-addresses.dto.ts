import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

export class WalletAddressExternalDataDto {
  @ApiProperty({ description: 'Nonce value' })
  @IsString()
  nonce: string;

  @ApiProperty({ description: 'Test value' })
  @IsString()
  test: string;

  [key: string]: any;
}

export class WalletAddressDto {
  @ApiPropertyOptional({ description: 'Wallet address ID' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: 'Wallet address string' })
  @IsString()
  wallet_address: string;

  @ApiProperty({ description: 'External data object', type: WalletAddressExternalDataDto })
  @ValidateNested()
  @Type(() => WalletAddressExternalDataDto)
  external_data: WalletAddressExternalDataDto;

  @ApiPropertyOptional({ description: 'Creation timestamp' })
  @IsOptional()
  @IsString()
  created_at?: string;

  @ApiPropertyOptional({ description: 'Update timestamp' })
  @IsOptional()
  @IsString()
  updated_at?: string;
}

export class CreateWalletAddressDto {
  @ApiProperty({ description: 'Wallet address data', type: WalletAddressDto })
  @ValidateNested()
  @Type(() => WalletAddressDto)
  wallet_address: WalletAddressDto;
}

export class UpdateWalletAddressDto {
  @ApiProperty({ description: 'Wallet address data', type: WalletAddressDto })
  @ValidateNested()
  @Type(() => WalletAddressDto)
  wallet_address: WalletAddressDto;
}
