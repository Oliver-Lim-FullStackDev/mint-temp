import { useQuery } from '@tanstack/react-query';
import type { Game } from '../games.types';
import { apiFetch } from '@mint/client';

const defaultParams = {
  tags: [] as string[],
  limit: 9999, // no limit for now
};

type SearchParams = {
  tags?: string[];
  limit?: number;
};

export function useGames(params: SearchParams = {}) {
  const payload = {
    tags: params.tags ?? defaultParams.tags,
    limit: params.limit ?? defaultParams.limit,
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
