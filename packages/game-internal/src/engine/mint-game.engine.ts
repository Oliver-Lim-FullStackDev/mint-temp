export interface MintGameContext<TConfig> {
  config: TConfig;
  rng: () => number;
}

export interface MintGameResult {
  isWin: boolean;
  payout: number;
  data: unknown;
}

export abstract class MintGameEngine<
  TConfig = unknown,
  TResult extends MintGameResult = MintGameResult,
> {
  protected config: TConfig;
  protected rng: () => number;

  protected constructor(context: MintGameContext<TConfig>) {
    this.config = context.config;
    this.rng = context.rng;
  }

  public async play(): Promise<TResult> {
    const result = await this.run();
    return result;
  }

  protected abstract run(): Promise<TResult>;
  protected abstract isWin(result: TResult): boolean;
  protected abstract getPayout(result: TResult): number;
}
