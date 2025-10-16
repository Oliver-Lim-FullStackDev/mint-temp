import type { MintSlotsConfig } from '@mint/slots';
import { Currency } from 'src/modules/wallet/dto/currency.dto';

export type ProvablyFairStrategy = 'vrf' | 'web2';

/** Full game config you return, extending the base slots config with visuals */
export type SlotGameConfig = MintSlotsConfig & {
  visuals: SlotVisualsConfig;
  /** Which provably fair implementation to use. Defaults to `vrf`. */
  pfStrategy?: ProvablyFairStrategy;
};

/** One spin’s full grid: an array of reels, each with an array of symbol keys */
export type SlotGrid = string[][];

export interface WinningCombination {
  type: 'horizontal' | 'diagonal-right' | 'diagonal-left' | 'symbolCount' | 'jackpot';
  symbol: string;
  count: number;
  payout: number;
  // position info for UI highlighting:
  startReel?: number;
  startRow?: number;
  actualCount?: number;
  multiplier?: number;
}

export interface SlotGameResult {
  data: SlotGrid;
  payout: number;
  isWin: boolean;
  winningCombinations: WinningCombination[];
  hasJackpot: boolean;
}

/** Visuals table for UI */

// One row in the symbols table (display-only)
export interface VisualWinCombo {
  key: string;                         // matches symbolWeights + asset filename
  label: string;
  imageUrl: string;
  rewards?: Record<Currency, number>;   // same numbers as rewards.baseBySymbol (for table)
  multiplier?: number;
  special?: boolean;
}

export interface SlotVisualsConfig {
  multipliers: VisualWinCombo[];
  winCombos: VisualWinCombo[];
}
