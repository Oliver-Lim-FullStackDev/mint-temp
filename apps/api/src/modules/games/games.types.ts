import { RawGame } from '@mint/types';

export type {
  Game,
  GameCategory,
  GameProvider,
  RawGame,
  RawGameCategory,
  RawGameProvider,
  RawGameProviderDetails,
  RawGameProviderValue,
  RawGameTag,
} from '@mint/types';

export type HeroGameSearchBucket = RawGame[] | { data: RawGame[] };

export interface GameSearchResponse {
  result: Record<string, HeroGameSearchBucket>;
}