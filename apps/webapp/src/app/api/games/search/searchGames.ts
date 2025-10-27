import { mintApi } from '@mint/client';
import type { Game } from 'src/modules/games/games.types';
import type { GamesOrderParam } from 'src/modules/games/filters.types';

export type GamesSearchRequest = {
  tags?: string[];
  limit?: number;
  offset?: number;
  search?: string;
  order?: GamesOrderParam;
  provider?: string;
  providers?: string[];
};

export function searchGames(body: GamesSearchRequest) {
  return mintApi.post<Game[]>('/games/search', body);
}
