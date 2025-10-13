import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReceiptDto {
  @ApiProperty({ description: 'Transaction ID' })
  transactionId: number;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ description: 'Amount in cents' })
  amountCents: number;

  @ApiProperty({ description: 'Original amount in cents' })
  originalAmountCents: number;

  @ApiProperty({ description: 'External unique ID' })
  externalUniqueId: string;

  @ApiProperty({ description: 'Fee amount in cents' })
  feeAmountCents: number;

  @ApiProperty({ description: 'Total amount in cents' })
  totalAmountCents: number;

  @ApiPropertyOptional({ description: 'External fee amount' })
  externalFeeAmount: number | null;

  @ApiPropertyOptional({ description: 'Transaction name' })
  txName: string | null;

  @ApiPropertyOptional({ description: 'Masked account' })
  maskedAccount: string | null;

  @ApiProperty({ description: 'Provider' })
  provider: string;

  @ApiPropertyOptional({ description: 'Sub provider' })
  subProvider: string | null;

  @ApiProperty({ description: 'Currency' })
  currency: string;

  @ApiProperty({ description: 'Original currency' })
  originalCurrency: string;

  @ApiProperty({ description: 'Transaction type' })
  type: 'DepositTransaction' | 'WithdrawTransaction';
}

export class ReceiptsMetaDto {
  @ApiProperty({ description: 'Current page' })
  page: number;

  @ApiProperty({ description: 'Total pages' })
  total_pages: number;
}

export class ReceiptsDataDto {
  @ApiProperty({ description: 'List of receipts', type: [ReceiptDto] })
  receipts: ReceiptDto[];

  @ApiProperty({ description: 'Pagination metadata' })
  meta: ReceiptsMetaDto;
}

export class ReceiptsResponseDto {
  @ApiProperty({ description: 'Whether the request was successful' })
  success: boolean;

  @ApiPropertyOptional({ description: 'Receipts data' })
  receipts?: ReceiptsDataDto;

  @ApiPropertyOptional({ description: 'Error message if request failed' })
  error?: string;
}
