import type { PlayerContext } from '@mint/gamestudio-api';

export type RandomnessType = 'VRF' | 'PF' | 'ON_CHAIN';

export interface RandomnessConfig {
  type: RandomnessType;
  /**
   * Optional metadata payload the randomness provider can surface to game studios
   * (e.g. VRF public keys, VRF proof endpoints, etc.).
   */
  meta?: Record<string, unknown>;
}

export interface RandomnessCommitment {
  hash: string;
}

export interface RandomnessSpinContext {
  /** Seed chosen by Mint for the current spin */
  serverSeed: string;
  /** Seed provided by the player (or generated) */
  clientSeed: string;
  /** Combined seed used by the RNG */
  combinedSeed: string;
  /** Deterministic RNG function */
  rng: () => number;
  /** Optional next commitment hash */
  nextHash?: string;
}

export interface RandomnessStrategy<RequestContext = unknown> {
  readonly type: RandomnessType;
  readonly config?: RandomnessConfig;
  commit(player: PlayerContext, request: RequestContext): Promise<RandomnessCommitment>;
  prepareSpin(
    player: PlayerContext,
    request: RequestContext,
    clientSeed?: string,
  ): Promise<RandomnessSpinContext>;
}
