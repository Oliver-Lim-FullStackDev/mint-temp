import type { MintSlotsConfig } from '@mint/slots';
import type { RandomnessConfig } from '../../randomness';

export type SlotGrid = string[][];

export interface WinningCombination {
  type: 'horizontal' | 'diagonal-right' | 'diagonal-left' | 'symbolCount' | 'jackpot';
  symbol: string;
  count: number;
  payout: number;
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

export type SlotRewards = Record<'MBX' | 'XPP' | 'RTP', number>;

export interface SlotPlayResult extends SlotGameResult {
  spinsRemaining: number;
  credits: number;
  rewards: SlotRewards | null;
}

export interface VisualWinCombo {
  key: string;
  label: string;
  imageUrl: string;
  rewards?: Record<string, number>;
  multiplier?: number;
  special?: boolean;
}

export interface SlotVisualsConfig {
  multipliers: VisualWinCombo[];
  winCombos: VisualWinCombo[];
}

export type SlotGameConfig = MintSlotsConfig & {
  visuals: SlotVisualsConfig;
  randomness: RandomnessConfig;
}
