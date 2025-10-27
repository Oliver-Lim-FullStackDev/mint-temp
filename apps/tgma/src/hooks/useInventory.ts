'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'src/modules/account/session-store';

export interface InventoryItem {
  id: number;
  active: boolean;
  activeFrom: string;
  amountCents: number;
  createdAt: string;
  currency: string;
  expiresAt: string;
  reason: string;
  redirectUrl: string | null;
  seen: boolean;
  turnoverCentsLeft: number;
  type: string;
  used: boolean;
  usedAt: string | null;
}

const INVENTORY_QUERY_KEY = 'user-inventory';

export function useInventory() {
  const { session } = useSession();
  const queryClient = useQueryClient();

  const fetchInventory = async (): Promise<InventoryItem[]> => {
    if (!session?.token) {
      throw new Error('No session token available');
    }

    const response = await fetch('/api/inventory', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': session.token,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch inventory: ${response.statusText}`);
    }

    return response.json();
  };

  const {
    data: inventory = [],
    isLoading,
    error,
    refetch,
  } = useQuery<InventoryItem[]>({
    queryKey: [INVENTORY_QUERY_KEY],
    queryFn: fetchInventory,
    enabled: !!session?.token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Helper functions
  const getDailyRewards = () => {
    return inventory?.filter(
      (item) =>
        item.reason.includes('daily-reward-campaign') &&
        item.active &&
        !item.used
    );
  };

  const hasDailyRewards = () => {
    return getDailyRewards().length > 0;
  };

  return {
    // Data
    inventory,
    dailyRewards: getDailyRewards(),
    hasDailyRewards: hasDailyRewards(),

    // State
    isLoading,
    error: error?.message || null,

    // Actions
    refetch,
  };
}
