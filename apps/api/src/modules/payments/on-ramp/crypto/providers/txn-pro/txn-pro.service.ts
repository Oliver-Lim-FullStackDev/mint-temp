import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { createHmac } from 'crypto';
import { PaymentProvider, Provider, PaymentRequest, PaymentResponse } from 'src/modules/payments/shared/payment.types';
import { ProviderConfig } from 'src/modules/payments/shared/payment.types';
import {
  TxnProConfig,
  TxnApiErrorResponse,
  CreateChannelRequest,
  ChannelResponse,
  CreateInvoiceRequest,
  InvoiceResponse,
  TxnInvoiceWebhookPayload,
  extractDepositInfo,
  InvoiceStatus,
} from './txn-pro.types';

@Injectable()
export class TxnProService implements PaymentProvider {
  readonly provider: Provider = 'txn.pro';
  private readonly logger = new Logger(TxnProService.name);
  private readonly config: TxnProConfig;

  constructor(config: ProviderConfig) {
    this.config = {
      name: config.name,
      apiKey: config.apiKey,
      apiUrl: config.apiUrl || 'https://api.sandbox.txn.pro',
      webhookSecret: config.webhookSecret,
      enabled: config.enabled,
    };

    if (!this.config.apiKey) {
      throw new Error('TXN_API_KEY is required for txn.pro provider');
    }

    this.logger.log(`TxnProService initialized`);
    this.logger.log(`  API URL: ${this.config.apiUrl}`);
    this.logger.log(`  API Key: ${this.config.apiKey?.substring(0, 10)}...`);
  }

  /**
   * Create headers for txn.pro API requests
   */
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${this.config.apiKey}`,
    };
  }

  /**
   * Handle API errors from txn.pro
   */
  private handleApiError(error: any, context: string): never {
    this.logger.error(`${context}:`, error);

    if (error.errors && Array.isArray(error.errors)) {
      const txnError = error as TxnApiErrorResponse;
      const firstError = txnError.errors[0];
      throw new BadRequestException(
        firstError.detail || firstError.title || 'Request failed',
      );
    }

    throw new InternalServerErrorException(
      error.message || 'An unexpected error occurred',
    );
  }

  /**
   * Create a crypto deposit channel for recurring deposits
   */
  async createDepositChannel(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const reference = request.reference || `crypto-channel-${request.userId}-${uuidv4()}`;

      this.logger.log(`Creating crypto deposit channel for user ${request.userId} - ${request.currency}`);

      const channelRequest: CreateChannelRequest = {
        data: {
          type: 'channels',
          attributes: {
            reference,
            status: 'enabled',
            targetCurrency: 'USD',
            payNetwork: this.getNetworkForCurrency(request.currency),
          },
        },
      };

      const response = await fetch(`${this.config.apiUrl}/api/public/v1/channels`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(channelRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        this.handleApiError(errorData, 'Create channel failed');
      }

      const result: ChannelResponse = await response.json();

      this.logger.log(`✅ Channel created successfully: ${result.data.id}`);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error('Error creating deposit channel:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Create a crypto deposit invoice
   */
  async createInvoice(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const reference = request.reference || `crypto-invoice-${request.userId}-${uuidv4()}`;

      this.logger.log(`Creating crypto deposit invoice for user ${request.userId} - ${request.amount} ${request.currency}`);

      const invoiceRequest: CreateInvoiceRequest = {
        data: {
          type: 'invoices',
          attributes: {
            reference,
            amountBilled: request.amount.toString(),
            billedCurrency: request.currency,
            chargedCurrency: request.currency,
            network: this.getNetworkForCurrency(request.currency),
          },
        },
      };

      const response = await fetch(`${this.config.apiUrl}/api/public/v1/invoices`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(invoiceRequest),
      });

      const responseText = await response.text();

      if (!response.ok) {
        this.logger.error(`TXN.pro API Error (${response.status}): ${responseText.substring(0, 200)}`);

        try {
          const errorData = JSON.parse(responseText);
          this.handleApiError(errorData, 'Create invoice failed');
        } catch (parseError) {
          throw new InternalServerErrorException(
            `TXN.pro API returned non-JSON response (${response.status}): ${responseText.substring(0, 100)}`
          );
        }
      }

      const result: InvoiceResponse = JSON.parse(responseText);

      this.logger.log(`✅ Invoice created successfully: ${result.data.id}`);

      return {
        success: true,
        data: result,
        invoiceId: result.data.id,
      };
    } catch (error) {
      this.logger.error('Error creating deposit invoice:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get invoice status
   */
  async getInvoiceStatus(invoiceId: string): Promise<PaymentResponse> {
    try {
      this.logger.log(`Getting invoice status for: ${invoiceId}`);

      const response = await fetch(`${this.config.apiUrl}/api/public/v1/invoices/${invoiceId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        this.handleApiError(errorData, 'Get invoice status failed');
      }

      const result: InvoiceResponse = await response.json();

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error('Error getting invoice status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Process webhook from txn.pro
   */
  async processWebhook(payload: any): Promise<PaymentResponse> {
    try {
      const webhookPayload = payload as TxnInvoiceWebhookPayload;
      const depositInfo = extractDepositInfo(webhookPayload);

      this.logger.log('🔔 Processing TXN.pro webhook');
      this.logger.log(`   Invoice ID: ${depositInfo.invoiceId}`);
      this.logger.log(`   Reference: ${depositInfo.reference}`);
      this.logger.log(`   Status: ${depositInfo.status}`);
      this.logger.log(`   Amount: ${depositInfo.amountBilled} ${depositInfo.billedCurrency}`);
      this.logger.log(`   Network: ${depositInfo.networkName}`);
      this.logger.log(`   Payment Status: ${depositInfo.paymentStatus}`);

      if (depositInfo.txHash) {
        this.logger.log(`   Transaction Hash: ${depositInfo.txHash}`);
      }

      // Handle different statuses
      switch (depositInfo.status) {
        case 'pending':
          this.logger.log('⏳ Payment is pending');
          break;

        case 'processing':
          this.logger.log('🔄 Payment is processing');
          break;

        case 'completed':
          this.logger.log('✅ PAYMENT COMPLETED!');
          this.logger.log(`💰 Processing transaction for: ${depositInfo.amountBilled} ${depositInfo.billedCurrency}`);
          break;

        case 'on_hold':
          this.logger.log('⏸️ Payment is on hold');
          break;

        case 'expired':
          this.logger.log('⏰ Payment has expired');
          break;

        case 'cancelled':
          this.logger.log('❌ Payment was cancelled');
          break;

        default:
          this.logger.warn(`⚠️ Unknown status: ${depositInfo.status}`);
      }

      this.logger.log('✅ Webhook processed successfully');

      return {
        success: true,
        data: {
          invoiceId: depositInfo.invoiceId,
          status: depositInfo.status,
          amount: depositInfo.amountBilled,
          currency: depositInfo.billedCurrency,
        },
      };
    } catch (error) {
      this.logger.error('Error processing webhook:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string, timestamp: string): boolean {
    if (!this.config.webhookSecret) {
      this.logger.warn('No webhook secret configured, skipping signature verification');
      return true;
    }

    // Allow test signatures for local development
    if (signature.startsWith('test_signature')) {
      this.logger.log('Using test signature, skipping verification');
      return true;
    }

    try {
      const expectedSignature = createHmac('sha256', this.config.webhookSecret)
        .update(timestamp + payload)
        .digest('hex');

      const providedSignature = signature.replace('sha256=', '');
      const isValid = expectedSignature === providedSignature;

      if (!isValid) {
        this.logger.error('Invalid webhook signature');
      }

      return isValid;
    } catch (error) {
      this.logger.error('Error verifying webhook signature:', error);
      return false;
    }
  }

  /**
   * Get network for currency
   */
  private getNetworkForCurrency(currency: string): string {
    const networkMap: Record<string, string> = {
      'USDT': 'ttrx:usdt',
      'BTC': 'btc:btc',
      'ETH': 'eth:eth',
      'SOL': 'sol:sol',
    };

    return networkMap[currency] || 'ttrx:usdt';
  }
}
