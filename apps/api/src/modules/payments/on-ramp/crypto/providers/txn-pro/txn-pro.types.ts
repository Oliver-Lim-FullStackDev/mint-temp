// TXN.pro specific types
export interface TxnProConfig {
  name: string;
  apiKey?: string;
  apiUrl?: string;
  webhookSecret?: string;
  enabled: boolean;
}

export interface TxnApiErrorResponse {
  errors: Array<{
    id?: string;
    status?: string;
    code?: string;
    title?: string;
    detail?: string;
    source?: {
      pointer?: string;
      parameter?: string;
    };
  }>;
}

export interface CreateChannelRequest {
  data: {
    type: 'channels';
    attributes: {
      reference: string;
      status: 'enabled' | 'disabled';
      targetCurrency: string;
      payNetwork: string;
    };
  };
}

export interface ChannelResponse {
  data: {
    type: 'channels';
    id: string;
    attributes: {
      reference: string;
      status: 'enabled' | 'disabled';
      targetCurrency: string;
      payNetwork: string;
      address: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export interface CreateInvoiceRequest {
  data: {
    type: 'invoices';
    attributes: {
      reference: string;
      amountBilled: string;
      billedCurrency: string;
      chargedCurrency: string;
      network: string;
    };
  };
}

export interface InvoiceResponse {
  data: {
    type: 'invoices';
    id: string;
    attributes: {
      reference: string;
      amountBilled: string;
      billedCurrency: string;
      chargedCurrency: string;
      network: string;
      status: string;
      address?: string;
      createdAt: string;
    };
  };
}

export type InvoiceStatus = 'pending' | 'processing' | 'completed' | 'on_hold' | 'expired' | 'cancelled';
export type PaymentStatus = 'expecting' | 'on_time' | 'late';
export type StatusContext = 'unpaid' | 'full' | 'partial' | 'overpaid';
export type PaymentMethod = 'on_chain' | 'binance_pay';
export type CoinTransactionState = 'processed' | 'on_hold_confirmed' | 'pending' | 'failed';
export type SimplifiedState = 'pending' | 'on_hold' | 'completed' | 'failed';

export interface TxnAddress {
  id: string;
  type: 'addresses';
  attributes: {
    createdAt: string;
    label: string;
    value: string;
  };
  relationships?: {
    account?: { meta: { included: boolean } };
    network?: { meta: { included: boolean } };
  };
}

export interface TxnCoinTransaction {
  id: string;
  type: 'coinTransactions';
  attributes: {
    accountId: string;
    amount: string;
    createdAt: string;
    currencyCode: string;
    state: CoinTransactionState;
    txHash: string;
  };
  relationships?: {
    address?: { meta: { included: boolean } };
    network?: { meta: { included: boolean } };
  };
}

export interface TxnInvoiceAttributes {
  amountBilled: string;
  amountCharged: string;
  billedCurrency: string;
  chargedCurrency: string;
  chargedTargetRate: string;
  chargedTargetRateCurrency: string;
  createdAt: string;
  exchangeRate: string;
  expiresAt: string;
  hostedPageUrl: string;
  network: string;
  networkName: string;
  paymentMethods: PaymentMethod[];
  paymentStatus: PaymentStatus;
  reference: string;
  status: InvoiceStatus;
  statusContext: StatusContext;
  successRedirectUrl: string;
  targetAmount: string;
  targetCurrency: string;
  unsuccessRedirectUrl: string;
}

export interface TxnInvoiceData {
  id: string;
  type: 'invoices';
  attributes: TxnInvoiceAttributes;
  relationships: {
    binanceOrder?: { data: { type: 'binanceOrders'; id: string } };
    address?: { data: { id: string; type: 'addresses' } };
    coinDeposits?: { data: Array<{ id: string; type: 'coinTransactions' }> };
    invoiceTransactions?: { data: Array<{ id: string; type: 'invoiceTransactions' }> };
    refundLinks?: { data: any[] };
  };
}

export type TxnIncludedResource = TxnAddress | TxnCoinTransaction;

export interface TxnInvoiceWebhookPayload {
  data: TxnInvoiceData;
  included: TxnIncludedResource[];
  meta: Record<string, any>;
}

export interface ProcessedDepositInfo {
  invoiceId: string;
  reference: string;
  status: InvoiceStatus;
  statusContext: StatusContext;
  amountBilled: string;
  billedCurrency: string;
  amountCharged: string;
  chargedCurrency: string;
  network: string;
  networkName: string;
  exchangeRate: string;
  paymentStatus: PaymentStatus;
  depositAddress?: string;
  txHash?: string;
  coinTransactionAmount?: string;
  coinTransactionState?: CoinTransactionState;
  createdAt: string;
  expiresAt: string;
  hostedPageUrl: string;
  successRedirectUrl: string;
  unsuccessRedirectUrl: string;
}

export function extractDepositInfo(payload: TxnInvoiceWebhookPayload): ProcessedDepositInfo {
  const { data, included } = payload;
  const { attributes } = data;

  const addressResource = included.find(
    (item) => item.type === 'addresses'
  ) as TxnAddress | undefined;

  const coinTransaction = included.find(
    (item) => item.type === 'coinTransactions'
  ) as TxnCoinTransaction | undefined;

  return {
    invoiceId: data.id,
    reference: attributes.reference,
    status: attributes.status,
    statusContext: attributes.statusContext,
    amountBilled: attributes.amountBilled,
    billedCurrency: attributes.billedCurrency,
    amountCharged: attributes.amountCharged,
    chargedCurrency: attributes.chargedCurrency,
    network: attributes.network,
    networkName: attributes.networkName,
    exchangeRate: attributes.exchangeRate,
    paymentStatus: attributes.paymentStatus,
    depositAddress: addressResource?.attributes.value,
    txHash: coinTransaction?.attributes.txHash,
    coinTransactionAmount: coinTransaction?.attributes.amount,
    coinTransactionState: coinTransaction?.attributes.state,
    createdAt: attributes.createdAt,
    expiresAt: attributes.expiresAt,
    hostedPageUrl: attributes.hostedPageUrl,
    successRedirectUrl: attributes.successRedirectUrl,
    unsuccessRedirectUrl: attributes.unsuccessRedirectUrl,
  };
}
