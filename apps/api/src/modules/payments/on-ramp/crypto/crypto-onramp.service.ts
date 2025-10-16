import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ProviderFactory } from 'src/modules/payments/shared/provider-factory';
import { getProviderForCurrency } from 'src/modules/payments/shared/payment-config';
import { Currency, PaymentRequest, PaymentResponse } from 'src/modules/payments/shared/payment.types';
import { TransactionService } from 'src/modules/transaction/transaction.service';
import {
  CryptoInvoiceRequest,
  CryptoInvoiceResponse,
  UserBalance,
  CreditBalanceRequest,
} from './crypto-onramp.types';
import { CreateCryptoInvoiceDto } from './crypto-onramp.dto';

@Injectable()
export class CryptoOnrampService {
  private readonly logger = new Logger(CryptoOnrampService.name);

  // In-memory storage for demo (replace with your database)
  private userBalances: Map<string, UserBalance> = new Map();
  private invoices: Map<string, CryptoInvoiceResponse> = new Map();

  constructor(
    private readonly providerFactory: ProviderFactory,
    private readonly transactionService: TransactionService,
  ) {}

  /**
   * Create a crypto deposit invoice
   */
  async createInvoice(dto: CreateCryptoInvoiceDto): Promise<CryptoInvoiceResponse> {
    try {
      const request: PaymentRequest = {
        userId: dto.userId,
        amount: dto.amount,
        currency: dto.currency as Currency,
        reference: dto.reference,
        playerId: dto.playerId,
      };

      // Get the appropriate provider for the currency
      const provider = await this.providerFactory.getProviderForCurrency(request.currency);

      this.logger.log(`Using ${provider.provider} provider for ${request.currency}`);

      // Create invoice with the provider
      const result = await provider.createInvoice(request);

      if (!result.success) {
        throw new BadRequestException(result.error || 'Failed to create invoice');
      }

      // Create our internal invoice record
      const invoice: CryptoInvoiceResponse = {
        invoiceId: result.invoiceId || `invoice_${uuidv4()}`,
        userId: request.userId,
        amount: request.amount,
        currency: request.currency,
        status: 'pending',
        provider: provider.provider,
        reference: request.reference,
        address: result.data?.data?.attributes?.address,
        hostedPageUrl: result.data?.data?.attributes?.hostedPageUrl,
        expiresAt: result.data?.data?.attributes?.expiresAt,
        createdAt: new Date().toISOString(),
      };

      this.invoices.set(invoice.invoiceId, invoice);

      this.logger.log(`✅ Crypto invoice created: ${invoice.invoiceId} via ${provider.provider}`);

      return invoice;
    } catch (error) {
      this.logger.error('Error creating crypto invoice:', error);
      throw error;
    }
  }

  /**
   * Get invoice details
   */
  async getInvoice(invoiceId: string): Promise<CryptoInvoiceResponse> {
    const invoice = this.invoices.get(invoiceId);
    if (!invoice) {
      throw new BadRequestException('Invoice not found');
    }

    // Get updated status from provider
    try {
      const provider = await this.providerFactory.getProvider(invoice.provider as any);
      const statusResult = await provider.getInvoiceStatus(invoiceId);

      if (statusResult.success && statusResult.data) {
        // Update local status
        invoice.status = statusResult.data.data?.attributes?.status || invoice.status;
        this.invoices.set(invoiceId, invoice);
      }
    } catch (error) {
      this.logger.warn(`Failed to get updated status for invoice ${invoiceId}:`, error);
    }

    return invoice;
  }

  /**
   * List user invoices
   */
  async listInvoices(userId: string, page: number = 1, perPage: number = 10): Promise<{
    invoices: CryptoInvoiceResponse[];
    total: number;
    page: number;
    perPage: number;
  }> {
    const allInvoices = Array.from(this.invoices.values())
      .filter(invoice => invoice.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedInvoices = allInvoices.slice(startIndex, endIndex);

    return {
      invoices: paginatedInvoices,
      total: allInvoices.length,
      page,
      perPage,
    };
  }

  /**
   * Process webhook from payment provider
   */
  async processWebhook(payload: any, provider: string, signature?: string, timestamp?: string): Promise<void> {
    try {
      this.logger.log(`🔔 Processing webhook from ${provider}`);

      // Get the provider instance
      const providerInstance = await this.providerFactory.getProvider(provider as any);

      // Verify signature if provided
      if (signature && timestamp) {
        const isValid = providerInstance.verifyWebhookSignature(
          JSON.stringify(payload),
          signature,
          timestamp,
        );

        if (!isValid) {
          throw new BadRequestException('Invalid webhook signature');
        }
      }

      // Process the webhook
      const result = await providerInstance.processWebhook(payload);

      if (!result.success) {
        throw new Error(result.error || 'Webhook processing failed');
      }

      // Handle completed payments
      if (result.data?.status === 'completed') {
        await this.handleCompletedPayment(result.data, provider);
      }

      this.logger.log(`✅ Webhook processed successfully for ${provider}`);
    } catch (error) {
      this.logger.error(`Error processing webhook from ${provider}:`, error);
      throw error;
    }
  }

  /**
   * Handle completed payment by creating HG transaction
   */
  private async handleCompletedPayment(webhookData: any, provider: string): Promise<void> {
    try {
      const { invoiceId, amount, currency } = webhookData;

      // Find the invoice
      const invoice = this.invoices.get(invoiceId);
      if (!invoice) {
        this.logger.warn(`Invoice ${invoiceId} not found for completed payment`);
        return;
      }

      this.logger.log(`🎉 Processing completed payment for invoice ${invoiceId}`);
      this.logger.log(`   User: ${invoice.userId}`);
      this.logger.log(`   Amount: ${amount} ${currency}`);

      // Create transaction in HG system
      const transactionId = `crypto_${invoiceId}_${uuidv4()}`;
      const transactionResult = await this.transactionService.processCryptoPurchase(
        parseFloat(amount.toString()),
        currency,
        transactionId,
        invoice.userId,
        webhookData.txHash || 'unknown',
        provider,
      );

      if (transactionResult.success) {
        this.logger.log(`🎉 Transaction created successfully in HG system!`);
        this.logger.log(`   Transaction ID: ${transactionId}`);

        // Credit user balance
        await this.creditUserBalance({
          userId: invoice.userId,
          amount: parseFloat(amount.toString()),
          currency,
          reference: invoice.reference || transactionId,
          txHash: webhookData.txHash || 'unknown',
        });

        // Update invoice status
        invoice.status = 'completed';
        this.invoices.set(invoiceId, invoice);
      } else {
        this.logger.error(`❌ Failed to create HG transaction: ${transactionResult.error}`);
      }
    } catch (error) {
      this.logger.error('Error handling completed payment:', error);
      throw error;
    }
  }

  /**
   * Credit user balance
   */
  async creditUserBalance(request: CreditBalanceRequest): Promise<void> {
    let userBalance = this.userBalances.get(request.userId);

    if (!userBalance) {
      userBalance = {
        userId: request.userId,
        balances: {},
      };
    }

    if (!userBalance.balances[request.currency]) {
      userBalance.balances[request.currency] = {
        amount: '0',
        currency: request.currency,
        lastUpdated: new Date().toISOString(),
        transactions: [],
      };
    }

    const currentAmount = parseFloat(userBalance.balances[request.currency].amount);
    const newAmount = currentAmount + request.amount;

    userBalance.balances[request.currency].amount = newAmount.toString();
    userBalance.balances[request.currency].lastUpdated = new Date().toISOString();
    userBalance.balances[request.currency].transactions.push({
      reference: request.reference,
      amount: request.amount.toString(),
      txHash: request.txHash,
      timestamp: new Date().toISOString(),
    });

    this.userBalances.set(request.userId, userBalance);

    this.logger.log(`💰 Credited ${request.amount} ${request.currency} to user ${request.userId}`);
  }

  /**
   * Get user balance
   */
  async getUserBalance(userId: string): Promise<UserBalance | null> {
    return this.userBalances.get(userId) || null;
  }

  /**
   * Extract user ID from reference
   */
  private extractUserIdFromReference(reference: string | null): string {
    if (!reference) {
      this.logger.warn('Reference is null or undefined, using default user ID');
      return 'unknown_user';
    }
    const parts = reference.split('-');
    if (parts.length >= 3) {
      return parts[2];
    }
    return reference;
  }
}
