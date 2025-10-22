export interface MintSlotsConfig {
  gameId: string;
  currency: string;
  initialSpins: number;
  initialCredits: number;
  spinCost: number;

  images?: {
    path: string;
  };

  symbolWeights: Record<string, number>;

  payouts: {
    enableMatchMultipliers: boolean;
    horizontalMatches: Partial<Record<number, number>>;
    diagonalMatches: Partial<Record<number, number>>;
    symbolCounts: Partial<Record<string, Partial<Record<number, number>>>>;
    jackpot: {
      symbol: string;
      count: number;
      payout: number;
    };
    rewards: {
      [key: string]: Record<string, number>
    };
  };

  sounds: {
    start: string;
    end: string;
    win: string;
  };
}

/** Typescript-safe for full config passed to `new Slot(...)` */
export interface SlotConstructorConfig {
  result: any;
  inverted?: boolean;
  gameConfig: MintSlotsConfig;

  /** Called at the very start of the spin animation */
  onSpinStart?: (symbols: string[]) => void;

  /** Called after all reels have stopped */
  onSpinEnd?: (symbols: string[], winResult: { payout: number; winningCombinations: any[]; hasJackpot: boolean }) => void;
}

export interface SlotSpinOptions {
  resultPromise?: Promise<any>;
  minSpinMs?: number;
}

export interface SlotInitParams {
  spinsRemaining: number;
  credits: number;
}

export default class Slot {
  constructor(container: HTMLElement, config: SlotConstructorConfig);
  config: SlotConstructorConfig;
  /**
   * Spin the reels.
   * - If called with no args: falls back to local/client mode (random/pattern).
   * - If called with { resultPromise }: starts spinning immediately and lands when promise resolves.
   */
  spin(options?: SlotSpinOptions): Promise<void>;
  init(params: SlotInitParams): void;
}
