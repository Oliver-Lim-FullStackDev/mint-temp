export interface ExchangeRequest {
  userId: string;
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  reference?: string;
}

export interface ExchangeResponse {
  exchangeId: string;
  userId: string;
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  result: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  provider: string;
  reference?: string;
  txHash?: string;
  createdAt: string;
  completedAt?: string;
}

export interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  lastUpdated: string;
  provider: string;
}

export interface CurrencyConversion {
  from: {
    currency: string;
    amount: number;
  };
  to: {
    currency: string;
    amount: number;
  };
  rate: {
    usdPerStar?: number;
    usdPerTon?: number;
  };
}
