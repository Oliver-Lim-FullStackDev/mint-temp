import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateExchangeDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsNotEmpty()
  fromCurrency: string;

  @IsString()
  @IsNotEmpty()
  toCurrency: string;

  @IsString()
  @IsOptional()
  reference?: string;
}

export class GetExchangeRateDto {
  @IsString()
  @IsNotEmpty()
  fromCurrency: string;

  @IsString()
  @IsNotEmpty()
  toCurrency: string;
}

export class ConvertCurrencyDto {
  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsString()
  @IsNotEmpty()
  from: string;

  @IsString()
  @IsNotEmpty()
  to: string;
}

export class GetExchangeHistoryDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  perPage?: number;
}
