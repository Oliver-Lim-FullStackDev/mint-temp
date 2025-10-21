export interface GameEngineAdapter<GameConfig = unknown, GameResult = unknown> {
  play(config: GameConfig, rng: () => number): Promise<GameResult> | GameResult;
}
