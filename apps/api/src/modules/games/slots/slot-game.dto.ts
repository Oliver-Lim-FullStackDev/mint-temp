import type { SlotGameConfig, SlotGrid, WinningCombination } from './slot-game.types';

export interface SlotGameRequestDto {
  clientSeed?: string;
  wager: number;
}

export interface SlotGameResultDto {
  result: {
    data: SlotGrid; // full 5×3 grid of symbol keys
    isWin: boolean;
    payout: number;
    winningCombinations: WinningCombination[];
    hasJackpot: boolean;
    spinsRemaining: number;
    credits: number;
    rewards: { MBX: number; XPP: number; RTP: number } | null;
  };
  wager: number;
  balance: {
    before: number;
    after: number;
  };
  pf: {
    type: 'vrf' | 'web2';
    serverSeed?: string;
    clientSeed?: string;
    combinedSeed?: string;
    hash?: string;
    seed?: string;
    proof?: string;
  };
  timestamp: string;
}

export interface SlotGameInitDto {
  config: SlotGameConfig;
  balances: { SPN: number };
  pf: { hash: string };
}
