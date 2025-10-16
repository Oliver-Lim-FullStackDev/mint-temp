import { MintGameEngine, MintGameContext } from 'src/shared/mint-game.engine';
import type { SlotGameConfig, SlotGameResult, WinningCombination, SlotGrid } from './slot-game.types';

/**
 * Server‐side slot engine.
 * Extends the provably‐fair MintGameEngine abstract class.
 * Generates a configurable grid (default 5×3), evaluates wins, and returns full result.
 */
export class SlotGameEngine extends MintGameEngine<SlotGameConfig, SlotGameResult> {
  private readonly width: number;
  private readonly height: number;

  /**
   * @param context  Provably‐fair context (config + RNG)
   * @param dimensions  Optional override for number of reels/rows
   */
  constructor(context: MintGameContext<SlotGameConfig>, dimensions: { reels?: number; rows?: number } = {}) {
    super(context);
    this.width = dimensions.reels ?? 5;
    this.height = dimensions.rows ?? 3;
  }

  /**
   * Core engine entry point.
   * Generates grid, evaluates all win types, and returns structured result.
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  protected async run(): Promise<SlotGameResult> {
    const grid = this.generateGrid();

    // Evaluate horizontal, diagonal, symbol counts, and jackpot
    const { payout, winningCombinations, hasJackpot } = this.evaluateGrid(grid);
    // WIN = any configured combo (incl. symbolCount) or jackpot
    const isWin = winningCombinations.length > 0 || hasJackpot;

    return {
      data: grid,
      payout,
      isWin,
      winningCombinations,
      hasJackpot,
    };
  }

  // MintGameEngine hooks to report win/payout
  protected isWin(result: SlotGameResult): boolean {
    return result.isWin;
  }
  protected getPayout(result: SlotGameResult): number {
    return result.payout;
  }

  /** Build a width×height grid of symbol keys using weighted RNG */
  private generateGrid(): SlotGrid {
    const grid: SlotGrid = [];
    const entries = Object.entries(this.config.symbolWeights);
    const totalWeight = entries.reduce((sum, [, w]) => sum + w, 0);

    for (let c = 0; c < this.width; c++) {
      const col: string[] = [];
      for (let r = 0; r < this.height; r++) {
        let roll = this.rng() * totalWeight;
        for (const [sym, w] of entries) {
          if (roll < w) {
            col.push(sym);
            break;
          }
          roll -= w;
        }
      }
      grid.push(col);
    }

    return grid;
  }

  /**
   * Runs all evaluation steps and collects winning combinations.
   */
  private evaluateGrid(grid: SlotGrid): {
    payout: number;
    winningCombinations: WinningCombination[];
    hasJackpot: boolean;
  } {
    let payout = 0;
    const winningCombinations: WinningCombination[] = [];

    payout += this.checkHorizontal(grid, winningCombinations);
    payout += this.checkDiagonals(grid, winningCombinations);
    payout += this.checkSymbolCounts(grid, winningCombinations);

    // Jackpot if symbolCounts + horizontal/diagonal didn't capture it
    const jackpotWin = this.checkJackpot(grid);
    if (jackpotWin > 0) {
      payout += jackpotWin;
      winningCombinations.push({
        type: 'jackpot',
        symbol: this.config.payouts.jackpot.symbol,
        count: this.config.payouts.jackpot.count,
        payout: jackpotWin,
      });
    }

    return { payout, winningCombinations, hasJackpot: jackpotWin > 0 };
  }

  private checkHorizontal(grid: SlotGrid, res: WinningCombination[]): number {
    let win = 0;
    for (let row = 0; row < this.height; row++) {
      for (let start = 0; start <= this.width - 3; start++) {
        for (let len = this.width - start; len >= 3; len--) {
          const slice = grid.slice(start, start + len).map((col) => col[row]);
          if (slice.every((s) => s === slice[0])) {
            const symbol = slice[0];
            let payout = 0;

            let multiplier;
            if (this.config.payouts.enableMatchMultipliers) {
              multiplier = this.config.payouts.horizontalMatches[len] ?? 0;
              const base = Number(this.config.payouts.rewards[symbol]?.[this.config.currency] ?? 0);
              payout = multiplier * base; // likely 0 because SPN base=0, that's fine
            } else {
              payout = this.config.payouts.horizontalMatches[len] ?? 0;
            }

            // FIX: always push combo so settle() can award MBX/XPP/RTP
            res.push({
              type: 'horizontal',
              count: len,
              payout,
              symbol,
              startReel: start,
              startRow: row,
              multiplier
            });

            win += payout;

            // Skip over the matched run to avoid counting embedded 4/3-of-a-kind
            start += (len - 1);
            break; // take the longest run starting at `start`
          }
        }
      }
    }
    return win;
  }

  private checkDiagonals(grid: SlotGrid, res: WinningCombination[]): number {
    let win = 0;

    // top-left → bottom-right
    for (let start = 0; start <= this.width - 3; start++) {
      for (let len = this.width - start; len >= 3; len--) {
        const diag = Array.from({ length: len }, (_, i) =>
          start + i < this.width && i < this.height ? grid[start + i][i] : null
        ).filter(Boolean) as string[];

        if (diag.length >= 3 && diag.every((s) => s === diag[0])) {
          const symbol = diag[0];
          let payout = 0;

          let multiplier;
          if (this.config.payouts.enableMatchMultipliers) {
            multiplier = this.config.payouts.diagonalMatches[diag.length] ?? 0;
            const base = Number(this.config.payouts.rewards[symbol]?.[this.config.currency] ?? 0);
            payout = multiplier * base;
          } else {
            payout = this.config.payouts.diagonalMatches[diag.length] ?? 0;
          }

          // FIX: always push
          res.push({
            type: 'diagonal-right',
            count: diag.length,
            payout,
            symbol,
            startReel: start,
            startRow: 0,
            multiplier
          });

          win += payout;
          break;
        }
      }
    }

    // top-right → bottom-left
    for (let start = this.width - 1; start >= 2; start--) {
      for (let len = start + 1; len >= 3; len--) {
        const diag = Array.from({ length: len }, (_, i) =>
          start - i >= 0 && i < this.height ? grid[start - i][i] : null
        ).filter(Boolean) as string[];

        if (diag.length >= 3 && diag.every((s) => s === diag[0])) {
          const symbol = diag[0];
          let payout = 0;

          let multiplier;
          if (this.config.payouts.enableMatchMultipliers) {
            multiplier = this.config.payouts.diagonalMatches[diag.length] ?? 0;
            const base = Number(this.config.payouts.rewards[symbol]?.[this.config.currency] ?? 0);
            payout = multiplier * base;
          } else {
            payout = this.config.payouts.diagonalMatches[diag.length] ?? 0;
          }

          // FIX: always push
          res.push({
            type: 'diagonal-left',
            symbol,
            count: diag.length,
            payout,
            startReel: start,
            startRow: 0,
            multiplier
          });

          win += payout;
          break;
        }
      }
    }

    return win;
  }

  private checkSymbolCounts(grid: SlotGrid, res: WinningCombination[]): number {
    const counts: Record<string, number> = {};
    grid.flat().forEach((s) => (counts[s] = (counts[s] || 0) + 1));

    let win = 0; // SPN contribution from symbolCount stays 0; rewards paid in settle()
    const symbolCountTables = this.config.payouts.symbolCounts ?? {};

    for (const symbol in symbolCountTables) {
      const table = symbolCountTables[symbol]!;
      const cnt = counts[symbol] || 0;

      // Treat keys as qualifying thresholds; ignore the value (your table currently has %s)
      let bestThreshold = 0;
      for (const thresholdStr in table) {
        const threshold = Number(thresholdStr);
        if (cnt >= threshold && threshold > bestThreshold) {
          bestThreshold = threshold;
        }
      }

      if (bestThreshold > 0) {
        res.push({
          type: 'symbolCount',
          symbol,
          count: bestThreshold,
          actualCount: cnt,
          payout: 0, // SPN payout is 0; settle() will award MBX/XPP/RTP
        });
      }
    }

    return win;
  }

  private checkJackpot(grid: SlotGrid): number {
    const jp = this.config.payouts.jackpot;
    const count = grid.flat().filter((s) => s === jp.symbol).length;
    return count >= jp.count ? jp.payout : 0;
  }
}
