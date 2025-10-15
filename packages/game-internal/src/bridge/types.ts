export interface GameDefinition<Config = unknown> {
  studioId: string;
  gameId: string;
  /**
   * Optional configuration reference that callers can expose to studios.
   * This should contain descriptive data only – gameplay logic lives in internal modules.
   */
  config?: Config;
}

export interface PlayerContext {
  playerId: string;
  sessionId: string;
  /**
   * Optional external metadata that adapters may require (wallet ids, partner ids, etc.).
   */
  meta?: Record<string, unknown>;
}

export interface PlayerProvider<RequestContext = unknown> {
  resolve(request: RequestContext): Promise<PlayerContext>;
}

export interface PlayerLookup {
  studioId: string;
  gameId: string;
}

export interface PlayerQuery<RequestContext = unknown> extends PlayerLookup {
  request: RequestContext;
}

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
