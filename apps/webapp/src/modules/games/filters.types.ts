import type { Game } from 'src/modules/games/games.types';

export type GamesSortOrder = '' | 'ASC' | 'DESC';
export type GamesOrderParam = Exclude<GamesSortOrder, ''>;

export type GamesCategoryOption = {
  slug: string;
  label: string;
  count: number;
};

export type GamesProviderOption = {
  value: string;
  label: string;
};

export type GamesFilters = {
  category: string;
  search: string;
  order: GamesSortOrder;
  provider: string;
};

export type GamesQueryParams = {
  category?: string;
  search?: string;
  order?: GamesOrderParam;
  provider?: string;
  limit?: number;
  offset?: number;
};

export type GamesQueryKey = ['games', GamesQueryParams];

export type GamesApiResponse = {
  games: Game[];
  meta: {
    total: number;
    categories: GamesCategoryOption[];
    providers: GamesProviderOption[];
  };
};
