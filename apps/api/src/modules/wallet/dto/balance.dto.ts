import { Currency } from './currency.dto';

export interface BalanceRequestDto {
  sessionId: string;
  currency: Currency;
  externalPlayerId?: string;
}

export interface BalanceResponseDto {
  balance: number;
  currency: Currency;
}
