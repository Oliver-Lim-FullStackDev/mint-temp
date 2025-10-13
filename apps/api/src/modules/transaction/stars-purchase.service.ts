import { Injectable, Logger } from '@nestjs/common';
import { TransactionService } from './transaction.service';

export interface StarsPurchaseRequest {
  itemId: string;
  amount: number;
  transactionId: string;
  username: string;
  playerId?: string;
}

export interface StarsPurchaseResult {
  success: boolean;
  purchaseId?: string;
  error?: string;
}

@Injectable()
export class StarsPurchaseService {
  private readonly logger = new Logger(StarsPurchaseService.name);

  constructor(private readonly transactionService: TransactionService) {}

  /**
   * Process a Stars purchase and store transaction data
   */
  async processPurchase(purchaseData: StarsPurchaseRequest): Promise<StarsPurchaseResult> {
    try {
      this.logger.log(`Processing Stars purchase for item ${purchaseData.itemId} for user ${purchaseData.username}`);

      // Store transaction data in Hero Gaming system
      const transactionResult = await this.transactionService.processStarsPurchase(
        purchaseData.itemId,
        purchaseData.amount,
        purchaseData.transactionId,
        purchaseData.username,
        purchaseData.playerId,
      );

      if (!transactionResult.success) {
        this.logger.error('Failed to store transaction data:', transactionResult.error);
        return {
          success: false,
          error: transactionResult.error || 'Failed to store transaction data',
        };
      }

      this.logger.log(`Successfully processed Stars purchase for user ${purchaseData.username}`);

      return {
        success: true,
        purchaseId: `stars_purchase_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      };
    } catch (error) {
      this.logger.error('Error processing Stars purchase:', error);
      return {
        success: false,
        error: `Failed to process purchase: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
}
