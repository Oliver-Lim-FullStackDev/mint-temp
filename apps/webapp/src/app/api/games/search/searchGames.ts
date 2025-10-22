import { mintApi } from '@mint/client';
import type { Game } from '@/modules/games/games.types';

export type GamesSearchRequest = {
  tags?: string[];
  limit?: number;
  offset?: number;
  search?: string;
  order?: 'ASC' | 'DESC';
  provider?: string;
  providers?: string[];
};

export function searchGames(body: GamesSearchRequest) {
  return mintApi.post<Game[]>('/games/search', body);
}