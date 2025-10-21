import type { BalanceResponse } from './payments';
import type { PlayerQuery } from './player';

export interface GameStudioInitRequest<RequestContext = unknown> extends PlayerQuery<RequestContext> {
  currency: string;
}

export interface GameStudioInitResponse<Config = unknown> {
  config?: Config;
  balances: Record<string, BalanceResponse['balance']>;
}
