import { Inject, Injectable, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { HeroGamingApiRoutes } from '../../shared/hero-gaming-api-routes';
import { SessionService } from '../session/session.service';

import { ReceiptDto, ReceiptsDataDto } from './receipts.dto';

export interface ReceiptsResponse {
  success: boolean;
  receipts?: ReceiptsDataDto;
  error?: string;
}

@Injectable()
export class ReceiptsService {
  private readonly logger = new Logger(ReceiptsService.name);
  private readonly baseUrl: string;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly sessionService: SessionService,
  ) {
    this.baseUrl = process.env.HEROGAMING_API_URL!;
  }

  /**
   * Get receipts for a specific user with filtering options
   */
  async getUserReceipts(sessionToken?: string): Promise<ReceiptsResponse> {
    try {
      this.logger.log('Fetching user receipts with filters');

      // Get session token from request if not provided
      const token = sessionToken || this.sessionService.getSessionIdFromHeaders();

      if (!token) {
        this.logger.error('No session token found in request');
        return {
          success: false,
          error: 'No session token found',
        };
      }

      // Support "Bearer <token>" or raw token
      const cleanToken = typeof token === 'string' && token.startsWith('Bearer ') ? token.slice(7) : token;

      const url = `${this.baseUrl}${HeroGamingApiRoutes.receipts}`;

      // Call Hero Gaming API to get filtered receipts using fetch
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.casinosaga.v1',
          'Content-Type': 'application/json',
          Authorization: cleanToken,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const receiptsData = (await response.json()) as {
        receipts: ReceiptDto[];
        meta: { page: number; total_pages: number };
      };
      this.logger.log(`Successfully fetched ${receiptsData.receipts.length} filtered receipts`);

      return {
        success: true,
        receipts: receiptsData,
      };
    } catch (error) {
      this.logger.error('Error fetching user receipts:', error);
      return {
        success: false,
        error: `Failed to fetch user receipts: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
}
