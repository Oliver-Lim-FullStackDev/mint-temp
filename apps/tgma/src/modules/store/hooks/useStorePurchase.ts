import { useMutation } from '@tanstack/react-query';

export interface TonPurchaseRequest {
  itemId: string;
  walletAddress: string;
  amount: number;
  transactionId: string;
  playerId?: string;
  username: string;
}

export interface StarsPurchaseRequest {
  itemId: string;
  amount: number;
  transactionId: string;
  username: string;
  playerId?: string;
}

export interface PurchaseResponse {
  success: boolean;
  purchaseId?: string;
  error?: string;
}

export function useTonPurchase() {
  return useMutation({
    mutationFn: async (data: TonPurchaseRequest): Promise<PurchaseResponse> => {
      const response = await fetch('/api/store/purchase/ton', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to store TON purchase');
      }

      return response.json();
    },
  });
}

export function useStarsPurchase() {
  return useMutation({
    mutationFn: async (data: StarsPurchaseRequest): Promise<PurchaseResponse> => {
      const response = await fetch('/api/store/purchase/stars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to store Stars purchase');
      }

      return response.json();
    },
  });
}