export interface GameDefinition<Config = unknown> {
  studioId: string;
  gameId: string;
  /**
   * Optional configuration reference that callers can expose to studios.
   * This should contain descriptive data only – gameplay logic lives in internal modules.
   */
  config?: Config;
}

export interface PlayerContext {
  playerId: string;
  sessionId: string;
  /**
   * Optional external metadata that adapters may require (wallet ids, partner ids, etc.).
   */
  meta?: Record<string, unknown>;
}
