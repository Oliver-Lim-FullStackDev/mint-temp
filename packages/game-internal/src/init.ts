import type { BalanceResponse, PlayerQuery } from './bridge';
import type { RandomnessType } from './randomness';

export interface GameInitRequest<RequestContext = unknown> extends PlayerQuery<RequestContext> {
  currency: string;
}

export interface GameInitResponse<Config = unknown> {
  config?: Config;
  balances: Record<string, BalanceResponse['balance']>;
  randomness: {
    type: RandomnessType;
    hash: string;
    meta?: Record<string, unknown>;
  };
  /**
   * @deprecated Use `randomness`.
   */
  pf?: {
    type: RandomnessType;
    hash: string;
    meta?: Record<string, unknown>;
  };
}
