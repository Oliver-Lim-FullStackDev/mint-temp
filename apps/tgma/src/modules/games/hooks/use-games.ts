import { useQuery } from '@tanstack/react-query';
import type { Game } from '../games.types';
import { apiFetch } from '@mint/client';

type OrderDirection = 'asc' | 'desc' | 'ASC' | 'DESC';

const DEFAULT_ORDER_FIELD = 'sort_order';

const defaultParams = {
  tags: ['mint', 'originals', 'tinyrex'],
  limit: 999,
  orderDirection: 'asc' as OrderDirection,
};

type SearchParams = {
  tags?: string[];
  limit?: number;
  orderDirection?: OrderDirection;
};

function buildOrderValue(field: string, direction: 'asc' | 'desc') {
  return direction === 'desc' ? `-${field}` : field;
}

export function useGames(params: SearchParams = {}) {
  const tags = params.tags ?? defaultParams.tags;
  const limit = params.limit ?? defaultParams.limit;
  const defaultDirection =
    defaultParams.orderDirection.toLowerCase() === 'desc' ? 'desc' : 'asc';
  const normalizedDirection: 'asc' | 'desc' =
    params.orderDirection?.toLowerCase() === 'desc' ? 'desc' : defaultDirection;

  const payload = {
    q: {
      results: {
        tags,
        limit,
        order: buildOrderValue(DEFAULT_ORDER_FIELD, normalizedDirection),
      },
    },
  };

  return useQuery({
    queryKey: ['games', payload],
    queryFn: async (): Promise<Game[]> => {
      try {
        const data = await apiFetch(`/games/search`, {
          method: 'POST',
          body: payload,
        });
        
        return data as Game[];
      } catch {
        throw new Error('Failed to get filtered games');
      }
    },
  });
}
