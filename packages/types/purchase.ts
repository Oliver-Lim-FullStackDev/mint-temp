/**
 * Shared types for purchase-related functionality
 */

// Interface for purchase data from Telegram payment payload
export interface PurchaseData {
  itemId: string;
  transactionId: string;
  username: string;
  playerId: string;
  amount: number;
}

// Interface for API response from purchase endpoints
export interface PurchaseApiResponse {
  success: boolean;
  purchaseId?: string;
  error?: string;
}

// Interface for Telegram payment data
export interface TelegramPaymentData {
  invoice_payload: string;
  telegram_payment_charge_id: string;
  provider_payment_charge_id: string;
  currency: string;
  total_amount: number;
}
