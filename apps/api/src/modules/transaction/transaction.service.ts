import { Inject, Injectable, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { HeroGamingApiRoutes } from '../../shared/hero-gaming-api-routes';
import {
  PaymentAuthorizeRequest,
  PaymentAuthorizeResponse,
  PaymentTransferRequest,
  PaymentTransferResponse,
} from '../../shared/hero-gaming.types';
import { extractSpinsFromItemId } from './utils';
import { SubProvider } from 'src/modules/payments/shared/payment.types';

export interface TransactionData {
  amount_cents: string;
  currency: string;
  transaction_id: string;
  username: string;
  sub_provider: SubProvider;
}

export interface PurchaseRequest {
  itemId: string;
  amount: number;
  transactionId: string;
  username: string;
  subProvider: string;
  currency?: string;
  walletAddress?: string;
  playerId?: string;
}

export interface TransactionResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface AuthorizationResult {
  success: boolean;
  authCode?: string;
  error?: string;
}

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  private readonly baseUrl: string;

  constructor(@Inject(REQUEST) private readonly request: Request) {
    this.baseUrl = process.env.HEROGAMING_API_URL!;
  }

  /**
   * Authorize a transaction (step 1 of the new two-step flow)
   */
  async authorizeTransaction(data: PaymentAuthorizeRequest): Promise<AuthorizationResult> {
    try {
      this.logger.log(`Authorizing transaction ${data.transaction_id} for user ${data.username}`);

      const response = await fetch(`${this.baseUrl}${HeroGamingApiRoutes.paymentsAuthorize}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${process.env.HEROGAMING_MINT_API_TOKEN}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Authorization failed with status ${response.status}: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: PaymentAuthorizeResponse = await response.json();

      this.logger.log(`Successfully authorized transaction ${data.transaction_id} with auth_code: ${result.auth_code}`);

      return {
        success: true,
        authCode: result.auth_code,
      };
    } catch (error) {
      this.logger.error('Error authorizing transaction:', error);
      return {
        success: false,
        error: `Failed to authorize transaction: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Transfer a transaction (step 2 of the new two-step flow)
   */
  async transferTransaction(data: PaymentTransferRequest): Promise<TransactionResult> {
    try {
      this.logger.log(
        `Transferring transaction ${data.transaction_id} for user ${data.username} with auth_code: ${data.auth_code}`,
      );

      const response = await fetch(`${this.baseUrl}${HeroGamingApiRoutes.paymentsTransfer}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${process.env.HEROGAMING_MINT_API_TOKEN}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Transfer failed with status ${response.status}: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: PaymentTransferResponse = await response.json();

      this.logger.log(`Successfully transferred transaction ${data.transaction_id}`);

      return {
        success: true,
        transactionId: data.transaction_id,
      };
    } catch (error) {
      this.logger.error('Error transferring transaction:', error);
      return {
        success: false,
        error: `Failed to transfer transaction: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Store transaction data in Hero Gaming system (legacy method - kept for backward compatibility)
   */
  async storeTransaction(data: TransactionData): Promise<TransactionResult> {
    try {
      this.logger.log(`Storing transaction ${data.transaction_id} for user ${data.username}`);

      // Call Hero Gaming API to store transaction data using fetch
      const response = await fetch(`${this.baseUrl}${HeroGamingApiRoutes.payments}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${process.env.HEROGAMING_MINT_API_TOKEN}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.logger.log(`Successfully stored transaction ${data.transaction_id}`);

      return {
        success: true,
        transactionId: data.transaction_id,
      };
    } catch (error) {
      this.logger.error('Error storing transaction:', error);
      return {
        success: false,
        error: `Failed to store transaction: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Process TON purchase
   */
  async processTonPurchase(
    itemId: string,
    amount: number,
    transactionId: string,
    walletAddress: string,
    username: string,
    playerId?: string,
  ): Promise<TransactionResult> {
    let authCode: string | undefined;

    try {
      this.logger.log(`Processing TON purchase for item ${itemId}`);

      // Extract spins from item ID
      const spins = extractSpinsFromItemId(itemId);

      // Step 1: Authorize the transaction
      const authorizeData: PaymentAuthorizeRequest = {
        amount_cents: (spins * 100).toString(), // Convert spins to cents
        currency: 'SPN',
        transaction_id: transactionId,
        username: username,
        sub_provider: SubProvider.TON,
        external_data: {
          wallet_address: walletAddress,
          item_id: itemId,
          amount: amount.toString(),
          ...(playerId ? { player_id: playerId } : {}),
        },
      };

      const authorizeResult = await this.authorizeTransaction(authorizeData);
      if (!authorizeResult.success) {
        return {
          success: false,
          error: authorizeResult.error || 'Failed to authorize transaction',
        };
      }

      authCode = authorizeResult.authCode;

      // Step 2: Transfer the transaction
      const transferData: PaymentTransferRequest = {
        username: username,
        currency: 'SPN',
        transaction_id: transactionId,
        status: 'accepted',
        auth_code: authCode!,
      };

      const transferResult = await this.transferTransaction(transferData);

      if (!transferResult.success) {
        // If transfer fails, cancel the transaction
        this.logger.warn(`Transfer failed for transaction ${transactionId}, canceling...`);
        await this.cancelTransaction(username, transactionId, authCode!);
        return transferResult;
      }

      return transferResult;
    } catch (error) {
      this.logger.error('Error processing TON purchase:', error);

      // If we have an auth code, cancel the transaction
      if (authCode) {
        this.logger.warn(`Canceling transaction ${transactionId} due to error`);
        try {
          await this.cancelTransaction(username, transactionId, authCode);
        } catch (cancelError) {
          this.logger.error('Failed to cancel transaction:', cancelError);
        }
      }

      return {
        success: false,
        error: `Failed to process TON purchase: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Process Stars purchase
   */
  async processStarsPurchase(
    itemId: string,
    amount: number,
    transactionId: string,
    username: string,
    playerId?: string,
  ): Promise<TransactionResult> {
    let authCode: string | undefined;

    try {
      this.logger.log(`Processing Stars purchase for item ${itemId}`);

      // Extract spins from item ID
      const spins = extractSpinsFromItemId(itemId);

      // Step 1: Authorize the transaction
      const authorizeData: PaymentAuthorizeRequest = {
        amount_cents: (spins * 100).toString(), // Convert spins to cents
        currency: 'SPN',
        transaction_id: transactionId,
        username: username,
        sub_provider: SubProvider.STARS,
        external_data: {
          item_id: itemId,
          amount: amount.toString(),
          ...(playerId ? { player_id: playerId } : {}),
        },
      };

      const authorizeResult = await this.authorizeTransaction(authorizeData);
      if (!authorizeResult.success) {
        return {
          success: false,
          error: authorizeResult.error || 'Failed to authorize transaction',
        };
      }

      authCode = authorizeResult.authCode;

      // Step 2: Transfer the transaction
      const transferData: PaymentTransferRequest = {
        username: username,
        currency: 'SPN',
        transaction_id: transactionId,
        status: 'accepted',
        auth_code: authCode!,
      };

      const transferResult = await this.transferTransaction(transferData);

      if (!transferResult.success) {
        // If transfer fails, cancel the transaction
        this.logger.warn(`Transfer failed for transaction ${transactionId}, canceling...`);
        await this.cancelTransaction(username, transactionId, authCode!);
        return transferResult;
      }

      return transferResult;
    } catch (error) {
      this.logger.error('Error processing Stars purchase:', error);

      // If we have an auth code, cancel the transaction
      if (authCode) {
        this.logger.warn(`Canceling transaction ${transactionId} due to error`);
        try {
          await this.cancelTransaction(username, transactionId, authCode);
        } catch (cancelError) {
          this.logger.error('Failed to cancel transaction:', cancelError);
        }
      }

      return {
        success: false,
        error: `Failed to process Stars purchase: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Process Crypto purchase (deposits via txn.pro)
   */
  async processCryptoPurchase(
    amount: number,
    currency: string,
    transactionId: string,
    username: string,
    txHash: string,
    provider: string, // Provider name (txn.pro, ston.fi, epocket, etc.)
  ): Promise<TransactionResult> {
    let authCode: string | undefined;

    try {
      this.logger.log(`Processing on-ramp: ${amount} ${currency} for user ${username} via ${provider}`);

      // Determine sub_provider based on provider and currency
      const subProvider = this.getSubProviderFromProvider(provider, currency);

      // Convert amount to cents
      const amountCents = Math.floor(amount * 100).toString();

      // Step 1: Authorize the transaction
      const authorizeData: PaymentAuthorizeRequest = {
        amount_cents: amountCents,
        currency: currency.toUpperCase(),
        transaction_id: transactionId,
        username: username,
        sub_provider: subProvider,
        external_data: {
          amount: amount.toString(),
          original_currency: currency,
          tx_hash: txHash,
          provider: provider,
        },
      };

      this.logger.log(`Authorizing: ${amountCents} cents in ${currency} (sub_provider: ${subProvider})`);

      const authorizeResult = await this.authorizeTransaction(authorizeData);
      if (!authorizeResult.success) {
        return {
          success: false,
          error: authorizeResult.error || 'Failed to authorize transaction',
        };
      }

      authCode = authorizeResult.authCode;

      // Step 2: Transfer the transaction
      const transferData: PaymentTransferRequest = {
        username: username,
        currency: currency.toUpperCase(),
        transaction_id: transactionId,
        sub_provider: subProvider,
        status: 'accepted',
        auth_code: authCode!,
      };

      const transferResult = await this.transferTransaction(transferData);

      if (!transferResult.success) {
        // If transfer fails, cancel the transaction
        this.logger.warn(`Transfer failed for transaction ${transactionId}, canceling...`);
        await this.cancelTransaction(username, transactionId, authCode!);
        return transferResult;
      }

      this.logger.log(`✅ On-ramp transaction completed: ${amount} ${currency} for ${username}`);

      return transferResult;
    } catch (error) {
      this.logger.error('Error processing Crypto purchase:', error);

      // If we have an auth code, cancel the transaction
      if (authCode) {
        this.logger.warn(`Canceling transaction ${transactionId} due to error`);
        try {
          await this.cancelTransaction(username, transactionId, authCode);
        } catch (cancelError) {
          this.logger.error('Failed to cancel transaction:', cancelError);
        }
      }

      return {
        success: false,
        error: `Failed to process Crypto purchase: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Cancel a transaction by sending cancel status
   */
  private async cancelTransaction(username: string, transactionId: string, authCode: string): Promise<void> {
    try {
      this.logger.log(`Canceling transaction ${transactionId} for user ${username}`);

      const cancelData: PaymentTransferRequest = {
        username: username,
        currency: 'SPN',
        transaction_id: transactionId,
        status: 'cancel',
        auth_code: authCode,
      };

      const response = await fetch(`${this.baseUrl}${HeroGamingApiRoutes.paymentsTransfer}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${process.env.HEROGAMING_MINT_API_TOKEN}`,
        },
        body: JSON.stringify(cancelData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Cancel failed with status ${response.status}: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.logger.log(`Successfully canceled transaction ${transactionId}`);
    } catch (error) {
      this.logger.error('Error canceling transaction:', error);
      throw error; // Re-throw to let caller handle it
    }
  }

  /**
   * Determine SubProvider from payment provider and currency
   */
  private getSubProviderFromProvider(provider: string, currency: string): string {
    // Map provider to SubProvider
    const currencyUpper = currency.toUpperCase();

    if (currencyUpper === 'TON') {
      return SubProvider.TON;
    } else if (currencyUpper === 'STARS') {
      return SubProvider.STARS;
    } else {
      // For all other currencies (USDT, BTC, ETH, USD, EUR, TRY, etc.)
      // Use a generic identifier based on the provider
      switch (provider) {
        case 'txn.pro':
          return 'TXN';
        case 'ston.fi':
          return 'STON';
        case 'epocket':
          return 'ePocket';
        case 'rhino.fi':
          return 'Rhino';
        default:
          return SubProvider.CRYPTO; // Fallback
      }
    }
  }
}
