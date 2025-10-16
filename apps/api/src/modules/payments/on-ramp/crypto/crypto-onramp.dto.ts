import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateCryptoInvoiceDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  playerId?: string;
}

export class GetCryptoInvoiceDto {
  @IsString()
  @IsNotEmpty()
  invoiceId: string;
}

export class ListCryptoInvoicesDto {
  @IsOptional()
  page?: number;

  @IsOptional()
  perPage?: number;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  userId?: string;
}

export class GetUserBalanceDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class CryptoWebhookDto {
  @IsNotEmpty()
  data: any;

  @IsOptional()
  included?: any[];

  @IsOptional()
  meta?: any;
}
