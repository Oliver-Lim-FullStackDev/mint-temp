import type { PlayerQuery } from '@mint/gamestudio-api';
import type { RandomnessType } from './randomness';

export interface GamePlayRequest<RequestContext = unknown> extends PlayerQuery<RequestContext> {
  clientSeed?: string;
  wager: number;
}

export interface GamePlayResponse<Result = unknown> {
  result: Result;
  wager: number;
  balance: {
    before: number;
    after: number;
  };
  randomness: {
    type: RandomnessType;
    serverSeed: string;
    clientSeed: string;
    combinedSeed: string;
    hash?: string;
  };
  /**
   * @deprecated Use `randomness`.
   */
  pf?: {
    type: RandomnessType;
    serverSeed: string;
    clientSeed: string;
    combinedSeed: string;
    hash?: string;
  };
  timestamp: string;
}

export interface GameSpinContext<Result = unknown, Rewards = unknown> {
  result: Result;
  rewards: Rewards;
  balanceBefore: number;
  balanceAfter: number;
  randomness: {
    serverSeed: string;
    clientSeed: string;
    combinedSeed: string;
    hash?: string;
  };
}
