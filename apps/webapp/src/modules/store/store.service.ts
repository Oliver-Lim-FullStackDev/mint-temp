'use client';

import { useState, useCallback } from 'react';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useInventory } from '@/hooks/useInventory';
import { useTonWalletPayment } from '../payment-methods';
import type { StoreItem, Purchase, CurrentPurchaseWithSecret, PaymentMethod } from './types';
import { SubProvider } from './types/sub-provider.enum';

export function useStore(shouldLoadItems: boolean = false, initialItems?: StoreItem[]) {
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const connected = !!address;
  const queryClient = useQueryClient();

  // Payment method services
  const tonWalletPayment = useTonWalletPayment();

  // Inventory hook
  const inventory = useInventory();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{
    type: 'purchase' | null;
    purchase?: CurrentPurchaseWithSecret;
  }>({ type: null });

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'ton',
      name: tonWalletPayment.config.displayName,
      description: 'Pay with TON cryptocurrency',
      icon: tonWalletPayment.config.icon,
      available: tonWalletPayment.isAvailable(),
    },
  ];

  // Fetch function for store items (static USD prices only)
  const fetchStoreItems = async (): Promise<StoreItem[]> => {
    const response = await fetch('/api/store/items');
    if (!response.ok) {
      throw new Error('Failed to fetch items');
    }
    return response.json();
  };

  // Use React Query for fetching items
  const hasPrefetchedItems = Array.isArray(initialItems) && initialItems.length > 0;
  const shouldFetchItems = Boolean(shouldLoadItems) || hasPrefetchedItems;

  const {
    data: items = hasPrefetchedItems ? initialItems : [],
    isLoading: loading,
    error: itemsError,
    refetch: refetchItems
  } = useQuery<StoreItem[]>({
    queryKey: ['store-items'],
    queryFn: fetchStoreItems,
    enabled: shouldFetchItems,
    initialData: hasPrefetchedItems ? initialItems : undefined,
    placeholderData: hasPrefetchedItems ? initialItems : undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const handlePurchase = async (item: StoreItem, paymentMethod: SubProvider) => {
    try {
      setIsLoading(true);
      setError(null);

      let result;
      if (paymentMethod === SubProvider.TON) {
        result = await tonWalletPayment.processPurchase(item);
      } else {
        throw new Error('Invalid payment method');
      }

      if (result.success && result.purchase) {
        // Invalidate receipts cache to show the new purchase
        queryClient.invalidateQueries({ queryKey: ['receipts'] });

        setModalState({
          type: 'purchase',
          purchase: {
            ...result.purchase,
            paymentMethod: 'ton'
          }
        });
      } else {
        setError(result.error || 'Purchase failed');
      }
    } catch (e) {
      console.error('Error during purchase:', e);
      setError(`Failed to process purchase: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to reveal secret for past purchases
  const revealSecret = async (purchase: Purchase) => {
    try {
      setIsLoading(true);
      const item = items.find(i => i.id === purchase.itemId);

      if (item) {
        setModalState({
          type: 'purchase',
          purchase: {
            item,
            transactionId: purchase.transactionId,
            timestamp: purchase.timestamp,
            secret: item.id, // In a real app, this would be retrieved from a secure source
            paymentMethod: purchase.paymentMethod
          }
        });
      }
    } catch (e) {
      console.error('Error fetching secret:', e);
      setError('Unable to retrieve the secret code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleCloseModal = () => {
    setModalState({ type: null });
  };

  const handleClearError = () => {
    setError(null);
  };

  const loadItems = useCallback(async () => {
    if (shouldFetchItems) {
      await refetchItems();
    }
  }, [shouldFetchItems, refetchItems]);

  return {
    // State
    items,
    loading,
    isLoading,
    error,
    modalState,
    connected,
    paymentMethods,

    // Inventory data
    inventory: inventory.inventory,
    dailyRewards: inventory.dailyRewards,
    hasDailyRewards: inventory.hasDailyRewards,
    inventoryLoading: inventory.isLoading,
    inventoryError: inventory.error,

    // Actions
    handlePurchase,
    revealSecret,
    handleRetry,
    handleCloseModal,
    handleClearError,
    loadItems,
    tonConnectUI,
    refetchInventory: inventory.refetch,
  };
}
