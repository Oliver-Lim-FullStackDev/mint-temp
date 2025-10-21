import { Controller, Get, Put, Req, Param } from '@nestjs/common';
import { Request } from 'express';
import { InventoryService } from './inventory.service';
import type { InventoryItem } from './inventory.types';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  /**
   * GET /inventory
   * Fetch user's inventory
   */
  @Get()
  async getUserInventory(@Req() req: Request): Promise<InventoryItem[]> {
    const sessionToken = req.headers.authorization || req.cookies['mint-session'];
    return this.inventoryService.getUserInventory(sessionToken);
  }

  /**
   * GET /inventory/daily-rewards
   * Get user's daily reward items
   */
  @Get('daily-rewards')
  async getDailyRewards(@Req() req: Request): Promise<InventoryItem[]> {
    const sessionToken = req.headers.authorization || req.cookies['mint-session'];
    return this.inventoryService.getDailyRewards(sessionToken);
  }

  /**
   * GET /inventory/has-daily-rewards
   * Check if user has available daily rewards
   */
  @Get('has-daily-rewards')
  async hasDailyRewards(@Req() req: Request): Promise<{ hasRewards: boolean }> {
    const sessionToken = req.headers.authorization || req.cookies['mint-session'];
    const hasRewards = await this.inventoryService.hasDailyRewards(sessionToken);
    return { hasRewards };
  }

  /**
   * PUT /inventory/:itemId/activate
   * Activate a specific inventory item
   */
  @Put(':itemId/activate')
  async activateItem(@Req() req: Request, @Param('itemId') itemId: string) {
    const sessionToken = req.headers.authorization || req.cookies['mint-session'];
    const result = await this.inventoryService.activateReward(sessionToken, itemId);
    return result;
  }
}
