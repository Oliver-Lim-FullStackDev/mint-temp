import { Inject, Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { type InventoryItem, DAILY_REWARDS_REASON_KEY } from './inventory.types';
import { HeroGamingApiRoutes } from '../../shared/hero-gaming-api-routes';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);
  private readonly baseUrl: string;

  constructor(@Inject(REQUEST) private readonly request: Request) {
    this.baseUrl = process.env.HEROGAMING_API_URL!;
  }

  /**
   * Fetch user inventory from the external API
   * @param sessionToken - User's session token for authentication
   * @returns Promise with inventory items
   */
  async getUserInventory(sessionToken?: string): Promise<InventoryItem[]> {
    if (!sessionToken) {
      throw new HttpException('Session token is required', HttpStatus.UNAUTHORIZED);
    }

    try {
      this.logger.log('Fetching user inventory');

      const url = `${this.baseUrl}${HeroGamingApiRoutes.inventory}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/vnd.casinosaga.v1',
          Authorization: sessionToken,
        },
      });

      if (!response.ok) {
        // TODO disabled as now it returns a 401 always. commenting allows us the app to progress
        // throw new HttpException(`External API error: ${response.status}`, HttpStatus.BAD_GATEWAY);
        return [] as InventoryItem[];
      }

      const data: InventoryItem[] = await response.json();

      this.logger.log(`Successfully fetched ${data.length} inventory items`);
      return data;
    } catch (error) {
      this.logger.error('Error fetching inventory:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to fetch inventory', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get daily reward items from user inventory
   * @param sessionToken - User's session token for authentication
   * @returns Promise with daily reward items
   */
  async getDailyRewards(sessionToken?: string): Promise<InventoryItem[]> {
    const inventory = await this.getUserInventory(sessionToken);

    return inventory.filter((item) => DAILY_REWARDS_REASON_KEY.includes(item.reason) && item.active && !item.used);
  }

  /**
   * Check if user has available daily rewards
   * @param sessionToken - User's session token for authentication
   * @returns Promise with boolean indicating if daily rewards are available
   */
  async hasDailyRewards(sessionToken?: string): Promise<boolean> {
    const dailyRewards = await this.getDailyRewards(sessionToken);
    return dailyRewards.length > 0;
  }

  /**
   * Activate a specific inventory item
   * @param sessionToken - User's session token for authentication
   * @param itemId - ID of the item to activate
   * @returns Promise with activation result
   */
  async activateReward(sessionToken?: string, itemId?: string): Promise<any> {
    if (!sessionToken) {
      throw new HttpException('Session token is required', HttpStatus.UNAUTHORIZED);
    }

    if (!itemId) {
      throw new HttpException('Item ID is required', HttpStatus.BAD_REQUEST);
    }

    try {
      this.logger.log(`Activating inventory item: ${itemId}`);

      const url = `${this.baseUrl}${HeroGamingApiRoutes.inventoryItem(itemId)}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/vnd.casinosaga.v1',
          Authorization: sessionToken,
        },
      });

      if (!response.ok) {
        throw new HttpException(`External API error: ${response.status}`, HttpStatus.BAD_GATEWAY);
      }

      const data = await response.json();

      this.logger.log(`Successfully activated inventory item: ${itemId}`);
      return data;
    } catch (error) {
      this.logger.error(`Error activating inventory item ${itemId}:`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to activate inventory item', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
