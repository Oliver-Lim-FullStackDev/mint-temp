import { Injectable } from '@nestjs/common';
import { HeroGamingApiRoutes } from 'src/shared/hero-gaming-api-routes';
import { HeroGamingClient } from 'src/shared/hero-gaming.client';
import { WalletAddress, WalletAddressRequest } from 'src/shared/hero-gaming.types';

@Injectable()
export class WalletAddressesService {
  constructor(private readonly hg: HeroGamingClient) {}

  /**
   * Create a new wallet address
   */
  async create(walletAddressData: WalletAddressRequest): Promise<WalletAddress> {
    return this.hg.v1.post<WalletAddress>(HeroGamingApiRoutes.walletAddresses, walletAddressData);
  }

  /**
   * Get all wallet addresses
   */
  async findAll(): Promise<WalletAddress[]> {
    return this.hg.v1.get<WalletAddress[]>(HeroGamingApiRoutes.walletAddresses);
  }

  /**
   * Get a specific wallet address by ID
   */
  async findOne(id: string): Promise<WalletAddress> {
    return this.hg.v1.get<WalletAddress>(HeroGamingApiRoutes.walletAddressById(id));
  }

  /**
   * Update a wallet address
   */
  async update(id: string, walletAddressData: WalletAddress): Promise<WalletAddress> {
    const requestBody: WalletAddressRequest = {
      wallet_address: walletAddressData,
    };

    return this.hg.v1.patch<WalletAddress>(HeroGamingApiRoutes.walletAddressById(id), requestBody);
  }

  /**
   * Delete a wallet address
   */
  async remove(id: string): Promise<void> {
    return this.hg.v1.delete<void>(HeroGamingApiRoutes.walletAddressById(id));
  }

  async checkHeroGamingUser(params: {
    telegramUsername?: string;
    userWalletAddress?: string;
  }): Promise<WalletAddress | null> {
    const { telegramUsername, userWalletAddress } = params;

    // Fetch all wallet addresses
    const walletAddressList = await this.findAll();

    if (!walletAddressList?.length) {
      return null;
    }

    // Check if any item matches the criteria
    const matchingItem = walletAddressList?.find((item) => {
      // Check if wallet address matches
      if (userWalletAddress && item.wallet_address === userWalletAddress) {
        return true;
      }

      // Check if telegram username matches
      if (telegramUsername && item.external_data?.username === telegramUsername) {
        return true;
      }

      return false;
    });

    return matchingItem || null;
  }

  /**
   * Store nonce for a wallet address
   * @param walletAddress - Wallet address string
   * @param nonce - Nonce string to store
   * @returns Promise<void>
   */
  async storeNonce(walletAddress: string, nonce: string): Promise<void> {
    // Check if wallet address already exists
    const existingWallet = await this.checkHeroGamingUser({
      userWalletAddress: walletAddress,
    });

    if (existingWallet) {
      // Update existing wallet with nonce
      const updatedExternalData = {
        ...existingWallet.external_data,
        nonce,
      };
      await this.update(existingWallet.id!, {
        ...existingWallet,
        external_data: updatedExternalData,
      });
    } else {
      // Create new wallet address with nonce
      await this.create({
        wallet_address: {
          wallet_address: walletAddress,
          external_data: {
            nonce,
          },
        },
      });
    }
  }

  /**
   * Check nonce for a wallet address
   * @param walletAddress - Wallet address string
   * @returns Promise<string | null> - Returns nonce if found, null otherwise
   */
  async checkNonce(walletAddress: string): Promise<string | null> {
    const wallet = await this.checkHeroGamingUser({
      userWalletAddress: walletAddress,
    });

    return wallet?.external_data?.nonce || null;
  }

  /**
   * Delete nonce for a wallet address
   * @param walletAddress - Wallet address string
   * @returns Promise<void>
   */
  async deleteNonce(walletAddress: string): Promise<void> {
    const existingWallet = await this.checkHeroGamingUser({
      userWalletAddress: walletAddress,
    });

    if (existingWallet) {
      // Remove nonce from external_data
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { nonce, ...externalDataWithoutNonce } = existingWallet.external_data;
      await this.update(existingWallet.id!, {
        ...existingWallet,
        external_data: externalDataWithoutNonce,
      });
    }
  }
}
