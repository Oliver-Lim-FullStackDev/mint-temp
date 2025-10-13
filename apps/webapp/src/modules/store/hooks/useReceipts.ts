import { useQuery } from '@tanstack/react-query';
import { ReceiptsResponse, Receipt } from '../types';
import { mintApi } from '@mint/client';

// Re-export the Receipt type for use in other components
export type { Receipt };

export function useReceipts() {
  return useQuery<ReceiptsResponse>({
    queryKey: ['receipts'],
    queryFn: async () => {
      const result = await mintApi.get<ReceiptsResponse>('/transaction/receipts');
      return result || { success: false, receipts: { receipts: [], meta: { page: 1, total_pages: 1 } } };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Helper hook to get just the receipts array
export function useReceiptsList() {
  const { data, isLoading, error, refetch } = useReceipts();

  return {
    receipts: data?.receipts?.receipts || [],
    meta: data?.receipts?.meta,
    isLoading,
    error,
    success: data?.success || false,
    refetch,
  };
}