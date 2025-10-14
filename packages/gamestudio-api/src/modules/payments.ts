import type { PlayerContext } from "./config";

export interface BalanceRequest {
  player: PlayerContext;
  currency: string;
}

export interface BalanceResponse {
  balance: number;
  currency: string;
}

export interface PaymentRequest {
  player: PlayerContext;
  currency: string;
  amount: number;
  transactionId: number;
  roundId: number;
  gameId: string;
}

export interface PaymentsAdapter {
  balance(request: BalanceRequest): Promise<BalanceResponse>;
  debit(request: PaymentRequest): Promise<void>;
  credit(request: PaymentRequest): Promise<void>;
}
