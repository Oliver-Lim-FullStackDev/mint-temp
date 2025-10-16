// Dynamic currency type - can be any string to support new currencies via env config
export type Currency = string;

// Common currencies (for reference)
export const CommonCurrencies = {
  USD: 'USD',
  EUR: 'EUR',
  TRY: 'TRY',
  USDT: 'USDT',
  BTC: 'BTC',
  ETH: 'ETH',
  SOL: 'SOL',
  TON: 'TON',
  STARS: 'STARS',
} as const;

export type Provider = 'txn.pro' | 'ston.fi' | 'epocket' | 'rhino.fi';
export type PaymentType = 'on-ramp' | 'off-ramp' | 'exchange';
export type PaymentMethod = 'crypto' | 'fiat';

/**
 * Sub-provider enum for Hero Gaming transaction system
 * Represents the payment method/provider used for a transaction
 */
export enum SubProvider {
  TON = 'TON',
  STARS = 'Stars',
  CRYPTO = 'Crypto',
}

export interface PaymentConfig {
  currency: Currency;
  provider: Provider;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  enabled: boolean;
}

export interface ProviderConfig {
  name: Provider;
  apiKey?: string;
  apiUrl?: string;
  webhookSecret?: string;
  enabled: boolean;
}

export interface PaymentRequest {
  userId: string;
  amount: number;
  currency: Currency;
  reference?: string;
  playerId?: string;
}

export interface PaymentResponse {
  success: boolean;
  data?: any;
  error?: string;
  transactionId?: string;
  invoiceId?: string;
}

export interface WebhookPayload {
  provider: Provider;
  data: any;
  signature?: string;
  timestamp?: string;
}

/**
 * Base interface for all payment providers
 */
export interface PaymentProvider {
  readonly provider: Provider;
  createInvoice(request: PaymentRequest): Promise<PaymentResponse>;
  getInvoiceStatus(invoiceId: string): Promise<PaymentResponse>;
  processWebhook(payload: any): Promise<PaymentResponse>;
  verifyWebhookSignature(payload: string, signature: string, timestamp: string): boolean;
}
