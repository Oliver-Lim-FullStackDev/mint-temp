import { useQuery } from '@tanstack/react-query';
import { mintApi } from '@mint/client';
import type { Game } from '../games.types';

export function useGame(id?: string) {
  return useQuery({
    enabled: !!id,
    queryKey: ['game', id],
    queryFn: async (): Promise<Game> => {
      const res = await mintApi.get(`/games/${id}`);
      return res;
    },
  });
}
