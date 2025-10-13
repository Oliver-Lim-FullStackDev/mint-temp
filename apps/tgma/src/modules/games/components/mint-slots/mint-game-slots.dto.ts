import type { MintSlotsConfig } from '@mint/slots';

export interface SlotSymbol {
  title: string;
  position: number;
  weight: number;
}

export interface SlotGameRequestDto {
  clientSeed?: string;
  wager: number;
}

export interface SlotGameConfig extends MintSlotsConfig {
  visuals: any;
}

export interface WinningCombination {
  type: 'horizontal' | 'diagonal-right' | 'diagonal-left' | 'symbolCount' | 'jackpot';
  symbol: string;
  count: number;
  payout: number;
  // position info for UI highlighting:
  startReel?: number;
  startRow?: number;
  actualCount?: number;
}

export type SlotGrid = string[][];

export interface SlotGameResultDto {
  result: {
    data: SlotGrid;
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
    serverSeed: string;
    clientSeed: string;
    combinedSeed: string;
    hash?: string;
  };
  timestamp: string;
}

export interface SlotGameInitDto {
  config: SlotGameConfig;
  balances: {
    MBX: number;
    SPN: number;
    XPP: number;
    RTF: number;
  }
}
