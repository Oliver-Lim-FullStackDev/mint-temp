import { StoreItem } from '../store/types';

export interface PaymentMethodConfig {
  name: string;
  displayName: string;
  icon: string;
  available: boolean;
}

export interface PurchaseResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  purchase?: {
    item: StoreItem;
    transactionId: string;
    timestamp: number;
    secret: string;
    paymentMethod: string;
  };
}

export interface PaymentMethodHandler {
  config: PaymentMethodConfig;
  processPurchase: (item: StoreItem) => Promise<PurchaseResult>;
  isAvailable: () => boolean;
  isLoading?: boolean;
  error?: Error | null;
}