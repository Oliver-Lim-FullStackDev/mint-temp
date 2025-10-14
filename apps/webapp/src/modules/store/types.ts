export interface StoreItem {
  id: string;
  title: string;
  description: string;
  price: StorePrice;
  imageUrl?: string;
  available: boolean;
}

export interface StorePrice {
  [key: string]: number;
}

export interface Purchase {
  userId: string;
  itemId: string;
  timestamp: number;
  transactionId: string;
  paymentMethod: 'ton' | 'telegram-stars';
}

export interface CurrentPurchaseWithSecret {
  item: StoreItem;
  transactionId: string;
  timestamp: number;
  secret: string;
  paymentMethod: 'ton' | 'telegram-stars';
}

export interface PaymentMethod {
  id: 'ton' | 'telegram-stars';
  name: string;
  description: string;
  icon: string;
  available: boolean;
}

export interface PriceData {
  usd: number;
  stars: number;
  ton: number;
  tonPriceUsd: number;
}

// Receipt types based on the API response
export interface Receipt {
  transactionId: number;
  createdAt: string;
  amountCents: number;
  originalAmountCents: number;
  externalUniqueId: string;
  feeAmountCents: number;
  totalAmountCents: number;
  externalFeeAmount: number | null;
  txName: string | null;
  maskedAccount: string | null;
  provider: string;
  subProvider: string | null;
  currency: string;
  originalCurrency: string;
  type: 'DepositTransaction' | 'WithdrawTransaction';
}

export interface ReceiptsMeta {
  page: number;
  total_pages: number;
}

export interface ReceiptsData {
  receipts: Receipt[];
  meta: ReceiptsMeta;
}

export interface ReceiptsResponse {
  success: boolean;
  receipts: ReceiptsData;
  error?: string;
}