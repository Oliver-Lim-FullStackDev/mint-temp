import { CasinoFilters, CasinoQueryParams } from '../types';

const DEFAULT_LIMIT = 48;

export function buildCasinoQuery(filters: CasinoFilters): CasinoQueryParams {
  const query: CasinoQueryParams = {
    limit: DEFAULT_LIMIT,
    offset: 0,
  };

  if (filters.category && filters.category !== 'all') {
    query.category = filters.category;
  }

  if (filters.search.trim()) {
    query.search = filters.search.trim();
  }

  if (filters.order && filters.order !== 'ASC') {
    query.order = filters.order;
  }

  if (filters.provider) {
    query.provider = filters.provider;
  }

  return query;
}
