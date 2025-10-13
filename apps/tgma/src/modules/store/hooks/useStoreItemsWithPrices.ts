import { useQuery } from '@tanstack/react-query';
import type { StoreItem } from '@/modules/store/types';

export function useStoreItemsWithPrices() {
  return useQuery({
    queryKey: ['storeItemsWithPrices'],
    queryFn: async (): Promise<StoreItem[]> => {
      const response = await fetch('/api/store/items/prices');
      if (!response.ok) {
        throw new Error('Failed to get store items with prices');
      }
      return response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useStoreItemWithPrices(itemId: string) {
  return useQuery({
    queryKey: ['storeItemWithPrices', itemId],
    queryFn: async (): Promise<StoreItem> => {
      const response = await fetch(`/api/store/items/${itemId}/prices`);
      if (!response.ok) {
        throw new Error('Failed to get store item with prices');
      }
      return response.json();
    },
    enabled: !!itemId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
