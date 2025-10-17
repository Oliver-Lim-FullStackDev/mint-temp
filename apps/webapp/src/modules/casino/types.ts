import type { Game } from '@/modules/games/games.types';

export type CasinoSortOrder = 'ASC' | 'DESC';

export type CasinoCategoryOption = {
  slug: string;
  label: string;
  count: number;
};

export type CasinoProviderOption = {
  value: string;
  label: string;
};

export type CasinoFilters = {
  category: string;
  search: string;
  order: CasinoSortOrder;
  provider: string;
};

export type CasinoQueryParams = {
  category?: string;
  search?: string;
  order?: CasinoSortOrder;
  provider?: string;
  limit?: number;
  offset?: number;
};

export type CasinoApiResponse = {
  games: Game[];
  meta: {
    total: number;
    categories: CasinoCategoryOption[];
    providers: CasinoProviderOption[];
  };
};
