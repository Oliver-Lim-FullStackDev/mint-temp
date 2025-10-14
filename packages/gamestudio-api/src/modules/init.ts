import type { BalanceResponse } from './payments';
import type { PlayerQuery } from './player';

export interface GameInitRequest<RequestContext = unknown> extends PlayerQuery<RequestContext> {
  currency: string;
}

export interface GameInitResponse<Config = unknown> {
  config?: Config;
  balances: Record<string, BalanceResponse['balance']>;
}
