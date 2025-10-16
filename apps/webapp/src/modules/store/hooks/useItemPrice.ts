import { useQuery } from '@tanstack/react-query';

export interface ItemPrice {
  usd: number;
  ton?: number;
}

export function useItemPrice(itemId: string) {
  return useQuery({
    queryKey: ['itemPrice', itemId],
    queryFn: async (): Promise<ItemPrice> => {
      const response = await fetch(`/api/store/items/${itemId}/prices`);
      if (!response.ok) {
        throw new Error('Failed to get item price');
      }
      return response.json();
    },
    enabled: !!itemId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}