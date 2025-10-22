import { Currency } from './currency.dto';

export interface CreditRequestDto {
  sessionId: string;
  currency: Currency;
  amount: number;
  gameId: string;
  transactionId: number;
  roundId: number;
  buyIn?: boolean;
  externalPlayerId?: string;
}

export interface CreditResponseDto {
  balance: number;
  currency: Currency;
}
