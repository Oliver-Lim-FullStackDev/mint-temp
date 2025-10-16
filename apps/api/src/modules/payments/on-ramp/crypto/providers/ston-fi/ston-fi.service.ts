import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { Omniston, SettlementMethod, GaslessSettlement, Blockchain } from '@ston-fi/omniston-sdk';
import { v4 as uuidv4 } from 'uuid';
import { PaymentProvider, Provider, PaymentRequest, PaymentResponse } from 'src/modules/payments/shared/payment.types';
import { ProviderConfig } from 'src/modules/payments/shared/payment.types';
import {
  StonFiConfig,
  StonFiQuote,
  StonFiQuoteRequest,
  StonFiInvoiceRequest,
  StonFiInvoiceResponse,
  StonFiWebhookPayload,
  ProcessedStonFiInfo,
} from './ston-fi.types';

@Injectable()
export class StonFiService implements PaymentProvider {
  readonly provider: Provider = 'ston.fi';
  private readonly logger = new Logger(StonFiService.name);
  private readonly config: StonFiConfig;
  private readonly omniston: Omniston;

  // In-memory storage for demo invoices
  private invoices: Map<string, StonFiInvoiceResponse> = new Map();

  constructor(config: ProviderConfig) {
    this.config = {
      name: config.name,
      apiUrl: config.apiUrl || 'wss://omni-ws.ston.fi',
      webhookSecret: config.webhookSecret,
      enabled: config.enabled,
    };

    this.omniston = new Omniston({
      apiUrl: this.config.apiUrl || 'wss://omni-ws.ston.fi',
    });

    this.logger.log(`StonFiService initialized with API URL: ${this.config.apiUrl}`);
  }

  /**
   * Create a TON/STARS invoice for conversion
   */
  async createInvoice(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const invoiceId = `stonfi_${uuidv4()}`;
      const reference = request.reference || `stonfi-invoice-${request.userId}-${uuidv4()}`;

      this.logger.log(`Creating STON.fi invoice for user ${request.userId} - ${request.amount} ${request.currency}`);

      // For TON/STARS, we need to determine the conversion
      const fromCurrency = this.getFromCurrency(request.currency);
      const toCurrency = request.currency;

      // Get quote for the conversion
      const quote = await this.getQuote(request.amount, fromCurrency, toCurrency);

      const invoice: StonFiInvoiceResponse = {
        invoiceId,
        amount: request.amount,
        fromCurrency,
        toCurrency,
        quote,
        reference,
        createdAt: new Date().toISOString(),
      };

      this.invoices.set(invoiceId, invoice);

      this.logger.log(`✅ STON.fi invoice created successfully: ${invoiceId}`);

      return {
        success: true,
        data: invoice,
        invoiceId,
      };
    } catch (error) {
      this.logger.error('Error creating STON.fi invoice:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get quote for currency conversion
   */
  async getQuote(amount: number, fromCurrency: string, toCurrency: string): Promise<StonFiQuote> {
    const USDT_ADDRESS = process.env.USDT_ADDRESS;
    const TON_ADDRESS = process.env.TON_ADDRESS;

    if (!USDT_ADDRESS || !TON_ADDRESS) {
      throw new Error('STON.fi environment variables not configured');
    }

    try {
      // Convert amount to appropriate units
      const amountUnits = this.convertToUnits(amount, fromCurrency);

      const quoteRequest: StonFiQuoteRequest = {
        settlementMethods: [SettlementMethod.SETTLEMENT_METHOD_SWAP],
        askAssetAddress: {
          blockchain: Blockchain.TON,
          address: toCurrency === 'TON' ? TON_ADDRESS : USDT_ADDRESS,
        },
        bidAssetAddress: {
          blockchain: Blockchain.TON,
          address: fromCurrency === 'USDT' ? USDT_ADDRESS : TON_ADDRESS,
        },
        amount: {
          bidUnits: amountUnits,
        },
        settlementParams: {
          maxPriceSlippageBps: 100, // 1% slippage
          gaslessSettlement: GaslessSettlement.GASLESS_SETTLEMENT_POSSIBLE,
          maxOutgoingMessages: 4,
        },
      };

      // Get quote from STON.fi
      const quote = await new Promise<StonFiQuote>((resolve, reject) => {
        const subscription = this.omniston.requestForQuote(quoteRequest).subscribe({
          next: (event) => {
            if (event.type === 'quoteUpdated') {
              subscription.unsubscribe();
              resolve(event.quote);
            } else if (event.type === 'noQuote') {
              subscription.unsubscribe();
              reject(new Error('No quote available'));
            }
          },
          error: (error) => {
            subscription.unsubscribe();
            reject(error);
          }
        });
      });

      return quote;
    } catch (error) {
      this.logger.error('Error getting STON.fi quote:', error);
      throw error;
    }
  }

  /**
   * Get invoice status
   */
  async getInvoiceStatus(invoiceId: string): Promise<PaymentResponse> {
    try {
      this.logger.log(`Getting STON.fi invoice status for: ${invoiceId}`);

      const invoice = this.invoices.get(invoiceId);
      if (!invoice) {
        return {
          success: false,
          error: 'Invoice not found',
        };
      }

      return {
        success: true,
        data: invoice,
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
   * Process webhook from STON.fi (simulated for now)
   */
  async processWebhook(payload: any): Promise<PaymentResponse> {
    try {
      const webhookPayload = payload as StonFiWebhookPayload;
      const processedInfo: ProcessedStonFiInfo = {
        invoiceId: webhookPayload.invoiceId,
        reference: webhookPayload.reference || '',
        status: webhookPayload.status,
        amount: webhookPayload.amount,
        fromCurrency: 'USDT', // Default for now
        toCurrency: webhookPayload.currency,
        txHash: webhookPayload.txHash,
        createdAt: webhookPayload.timestamp,
      };

      this.logger.log('🔔 Processing STON.fi webhook');
      this.logger.log(`   Invoice ID: ${processedInfo.invoiceId}`);
      this.logger.log(`   Reference: ${processedInfo.reference}`);
      this.logger.log(`   Status: ${processedInfo.status}`);
      this.logger.log(`   Amount: ${processedInfo.amount} ${processedInfo.toCurrency}`);

      if (processedInfo.txHash) {
        this.logger.log(`   Transaction Hash: ${processedInfo.txHash}`);
      }

      // Handle different statuses
      switch (processedInfo.status) {
        case 'pending':
          this.logger.log('⏳ STON.fi transaction is pending');
          break;

        case 'processing':
          this.logger.log('🔄 STON.fi transaction is processing');
          break;

        case 'completed':
          this.logger.log('✅ STON.FI TRANSACTION COMPLETED!');
          this.logger.log(`💰 Processing transaction for: ${processedInfo.amount} ${processedInfo.toCurrency}`);
          break;

        case 'failed':
          this.logger.log('❌ STON.fi transaction failed');
          break;

        default:
          this.logger.warn(`⚠️ Unknown STON.fi status: ${processedInfo.status}`);
      }

      this.logger.log('✅ STON.fi webhook processed successfully');

      return {
        success: true,
        data: {
          invoiceId: processedInfo.invoiceId,
          status: processedInfo.status,
          amount: processedInfo.amount,
          currency: processedInfo.toCurrency,
        },
      };
    } catch (error) {
      this.logger.error('Error processing STON.fi webhook:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Verify webhook signature (placeholder for now)
   */
  verifyWebhookSignature(payload: string, signature: string, timestamp: string): boolean {
    // STON.fi webhook verification logic would go here
    // For now, we'll allow test signatures
    if (signature.startsWith('test_signature')) {
      this.logger.log('Using test signature for STON.fi, skipping verification');
      return true;
    }

    // TODO: Implement proper STON.fi webhook signature verification
    this.logger.warn('STON.fi webhook signature verification not implemented yet');
    return true;
  }

  /**
   * Convert amount to appropriate units based on currency
   */
  private convertToUnits(amount: number, currency: string): string {
    switch (currency) {
      case 'USDT':
        return (amount * 1000000).toString(); // 6 decimals
      case 'TON':
        return (amount * 1000000000).toString(); // 9 decimals (nanoTON)
      default:
        return amount.toString();
    }
  }

  /**
   * Get from currency based on to currency
   */
  private getFromCurrency(toCurrency: string): string {
    switch (toCurrency) {
      case 'TON':
        return 'USDT';
      case 'STARS':
        return 'TON';
      default:
        return 'USDT';
    }
  }
}
