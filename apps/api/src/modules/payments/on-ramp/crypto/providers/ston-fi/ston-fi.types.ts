import { SettlementMethod, GaslessSettlement, Blockchain } from '@ston-fi/omniston-sdk';

export interface StonFiConfig {
  name: string;
  apiUrl?: string;
  webhookSecret?: string;
  enabled: boolean;
}

export interface StonFiQuote {
  askUnits?: string;
  askAmount?: {
    units: number;
  };
}

export interface StonFiQuoteRequest {
  settlementMethods: SettlementMethod[];
  askAssetAddress: {
    blockchain: Blockchain;
    address: string;
  };
  bidAssetAddress: {
    blockchain: Blockchain;
    address: string;
  };
  amount: {
    bidUnits: string;
  };
  settlementParams: {
    maxPriceSlippageBps: number;
    gaslessSettlement: GaslessSettlement;
    maxOutgoingMessages: number;
  };
}

export interface StonFiInvoiceRequest {
  userId: string;
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  reference?: string;
}

export interface StonFiInvoiceResponse {
  invoiceId: string;
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  quote?: StonFiQuote;
  reference?: string;
  createdAt: string;
}

export interface StonFiWebhookPayload {
  invoiceId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  amount: number;
  currency: string;
  txHash?: string;
  reference?: string;
  timestamp: string;
}

export interface ProcessedStonFiInfo {
  invoiceId: string;
  reference: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  txHash?: string;
  createdAt: string;
}
