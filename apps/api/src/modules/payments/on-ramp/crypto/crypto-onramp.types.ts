// Crypto on-ramp specific types
export interface CryptoInvoiceRequest {
  userId: string;
  amount: number;
  currency: string;
  reference?: string;
  playerId?: string;
}

export interface CryptoInvoiceResponse {
  invoiceId: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  reference?: string;
  address?: string;
  hostedPageUrl?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface UserBalance {
  userId: string;
  balances: {
    [currency: string]: {
      amount: string;
      currency: string;
      lastUpdated: string;
      transactions: Array<{
        reference: string;
        amount: string;
        txHash: string;
        timestamp: string;
      }>;
    };
  };
}

export interface CreditBalanceRequest {
  userId: string;
  amount: number;
  currency: string;
  reference: string;
  txHash: string;
}
