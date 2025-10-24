import { IsEnum, IsOptional } from 'class-validator';
import { CurrencyType } from './currencies.types';

/**
 * Query DTO for filtering currencies
 */
export class GetCurrenciesQueryDto {
  /**
   * Optional filter by currency type
   */
  @IsOptional()
  @IsEnum(CurrencyType)
  type?: CurrencyType;

  /**
   * Optional filter for enabled currencies only
   */
  @IsOptional()
  enabled?: boolean;
}

