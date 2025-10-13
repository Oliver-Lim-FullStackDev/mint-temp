import { Injectable, Logger } from '@nestjs/common';
import { HeroGamingClient } from '../../shared/hero-gaming.client';
import { WalletAddress } from '../../shared/hero-gaming.types';
import { WalletAddressesService } from '../wallet-addresses/wallet-addresses.service';
import { TransactionService } from './transaction.service';

export interface TonPurchaseRequest {
  itemId: string;
  walletAddress: string;
  amount: number;
  transactionId: string;
  username: string;
  playerId?: string;
}

export interface TonPurchaseResult {
  success: boolean;
  purchaseId?: string;
  walletAddress?: WalletAddress;
  error?: string;
}

@Injectable()
export class TonPurchaseService {
  private readonly logger = new Logger(TonPurchaseService.name);

  constructor(
    private readonly walletAddressesService: WalletAddressesService,
    private readonly hg: HeroGamingClient,
    private readonly transactionService: TransactionService,
  ) {}

  /**
   * Process a TON purchase and store wallet data in Hero's system
   */
  async processPurchase(purchaseData: TonPurchaseRequest): Promise<TonPurchaseResult> {
    try {
      this.logger.log(
        `Processing TON purchase for item ${purchaseData.itemId} from wallet ${purchaseData.walletAddress}`,
      );

      // 1. Store transaction data in Hero Gaming system
      const transactionResult = await this.transactionService.processTonPurchase(
        purchaseData.itemId,
        purchaseData.amount,
        purchaseData.transactionId,
        purchaseData.walletAddress,
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

      // 2. Check if wallet already exists in Hero's system
      const existingWallet = await this.walletAddressesService.checkHeroGamingUser({
        userWalletAddress: purchaseData.walletAddress,
      });

      if (existingWallet) {
        // Update existing wallet with purchase information
        return await this.updateExistingWallet(existingWallet, purchaseData);
      } else {
        // Create new wallet entry
        return await this.createNewWallet(purchaseData);
      }
    } catch (error) {
      this.logger.error('Error processing TON purchase:', error);
      return {
        success: false,
        error: `Failed to process purchase: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Update existing wallet with new purchase information
   */
  private async updateExistingWallet(
    existingWallet: WalletAddress,
    purchaseData: TonPurchaseRequest,
  ): Promise<TonPurchaseResult> {
    try {
      // Update external_data with purchase information
      const updatedExternalData: WalletAddress['external_data'] = {
        ...existingWallet.external_data,
        lastPurchase: {
          itemId: purchaseData.itemId,
          amount: purchaseData.amount,
          transactionId: purchaseData.transactionId,
          timestamp: new Date().toISOString(),
        },
        purchaseCount: (existingWallet.external_data.purchaseCount || 0) + 1,
        totalSpent: (existingWallet.external_data.totalSpent || 0) + purchaseData.amount,
      };

      // If we have a playerId, link it to the wallet
      if (purchaseData.playerId) {
        updatedExternalData.playerId = purchaseData.playerId;
      }

      const updatedWallet = await this.walletAddressesService.update(existingWallet.id!, {
        ...existingWallet,
        external_data: updatedExternalData,
      });

      this.logger.log(`Updated existing wallet ${existingWallet.id} with purchase data`);

      return {
        success: true,
        purchaseId: `purchase_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        walletAddress: updatedWallet,
      };
    } catch (error) {
      this.logger.error('Error updating existing wallet:', error);
      return {
        success: false,
        error: `Failed to update wallet: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Create new wallet entry in Hero's system
   */
  private async createNewWallet(purchaseData: TonPurchaseRequest): Promise<TonPurchaseResult> {
    try {
      // Prepare external data for new wallet
      const externalData: WalletAddress['external_data'] = {
        username: purchaseData.username,
        lastPurchase: {
          itemId: purchaseData.itemId,
          amount: purchaseData.amount,
          transactionId: purchaseData.transactionId,
          timestamp: new Date().toISOString(),
        },
        purchaseCount: 1,
        totalSpent: purchaseData.amount,
        firstPurchase: new Date().toISOString(),
      };

      // If we have a playerId, include it
      if (purchaseData.playerId) {
        externalData.playerId = purchaseData.playerId;
      }

      // Create new wallet address in Hero's system
      const newWallet = await this.walletAddressesService.create({
        wallet_address: {
          wallet_address: purchaseData.walletAddress,
          external_data: externalData,
        },
      });

      this.logger.log(`Created new wallet ${newWallet.id} for address ${purchaseData.walletAddress}`);

      return {
        success: true,
        purchaseId: `purchase_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        walletAddress: newWallet,
      };
    } catch (error) {
      this.logger.error('Error creating new wallet:', error);
      return {
        success: false,
        error: `Failed to create wallet: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Get wallet information by address
   */
  async getWalletInfo(walletAddress: string): Promise<WalletAddress | null> {
    try {
      return await this.walletAddressesService.checkHeroGamingUser({
        userWalletAddress: walletAddress,
      });
    } catch (error) {
      this.logger.error('Error getting wallet info:', error);
      return null;
    }
  }

  /**
   * Get purchase history for a wallet
   */
  async getPurchaseHistory(walletAddress: string): Promise<any[]> {
    try {
      const wallet = await this.getWalletInfo(walletAddress);
      if (!wallet) {
        return [];
      }

      // For now, we'll return basic purchase info from external_data
      // In a real implementation, you might want to store purchases separately
      const purchaseHistory: any[] = [];

      if (wallet.external_data.lastPurchase) {
        purchaseHistory.push(wallet.external_data.lastPurchase);
      }

      return purchaseHistory;
    } catch (error) {
      this.logger.error('Error getting purchase history:', error);
      return [];
    }
  }

  /**
   * Link a player ID to a wallet address
   */
  async linkPlayerToWallet(walletAddress: string, playerId: string): Promise<boolean> {
    try {
      const existingWallet = await this.walletAddressesService.checkHeroGamingUser({
        userWalletAddress: walletAddress,
      });

      if (existingWallet) {
        // Update existing wallet with player ID
        const updatedExternalData = {
          ...existingWallet.external_data,
          playerId,
        };

        await this.walletAddressesService.update(existingWallet.id!, {
          ...existingWallet,
          external_data: updatedExternalData,
        });

        this.logger.log(`Linked player ${playerId} to wallet ${walletAddress}`);
        return true;
      } else {
        // Create new wallet with player ID
        await this.walletAddressesService.create({
          wallet_address: {
            wallet_address: walletAddress,
            external_data: {
              playerId,
              username: `player_${playerId}`,
            },
          },
        });

        this.logger.log(`Created new wallet for player ${playerId} with address ${walletAddress}`);
        return true;
      }
    } catch (error) {
      this.logger.error('Error linking player to wallet:', error);
      return false;
    }
  }
}
