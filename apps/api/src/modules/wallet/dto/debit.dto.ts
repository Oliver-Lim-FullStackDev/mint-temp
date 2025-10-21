import { Currency } from './currency.dto';

export interface DebitRequestDto {
  sessionId: string;
  currency: Currency;
  amount: number;
  gameId: string;
  transactionId: number;
  roundId: number;
  buyIn?: boolean;
  nr_of_rounds?: number;
  externalPlayerId?: string;
}

export interface DebitResponseDto {
  balance: number;
  currency: Currency;
}
