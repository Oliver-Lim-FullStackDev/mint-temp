import type { Campaign } from './missions.types';

import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Inject, Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HeroGamingApiRoutes } from 'src/shared/hero-gaming-api-routes';
import { HeroGamingClient } from 'src/shared/hero-gaming.client';
import { CampaignResponse, LeaderBoardData } from './missions.dto';

@Injectable()
export class MissionsService {
  private readonly logger = new Logger(MissionsService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly hg: HeroGamingClient,
    @Inject(REQUEST) private readonly request: Request
  ) {
    this.baseUrl = process.env.HEROGAMING_API_URL!;
  }

  async findAll(sessionToken?: string): Promise<Campaign[]> {
    try {
      if (!sessionToken) {
        throw new HttpException('Session token is required', HttpStatus.UNAUTHORIZED);
      }

      this.logger.log('Fetching user campaigns');

      const url = `${this.baseUrl}${HeroGamingApiRoutes.campaigns}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/vnd.casinosaga.v2',
          Authorization: sessionToken,
        },
      });

      if (!response.ok) {
        throw new HttpException(`External API error: ${response.status}`, HttpStatus.BAD_GATEWAY);
      }

      const campaigns = (await response.json()) as Campaign[];
      this.logger.log(`Successfully fetched ${campaigns.length} campaigns`);

      return campaigns;
    } catch (error) {
      this.logger.error('Error fetching campaigns:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to fetch campaigns', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async optInCampaign(sessionToken: string, campaignId: number): Promise<CampaignResponse> {
    try {
      if (!sessionToken) {
        throw new HttpException('Session token is required', HttpStatus.UNAUTHORIZED);
      }

      this.logger.log(`Opting into campaign ${campaignId}`);

      const url = `${this.baseUrl}${HeroGamingApiRoutes.optedInCampaigns}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/vnd.casinosaga.v2',
          Authorization: sessionToken,
        },
        body: JSON.stringify({ campaign_id: campaignId }),
      });

      if (!response.ok) {
        throw new HttpException(`External API error: ${response.status}`, HttpStatus.BAD_GATEWAY);
      }

      await response.json();
      this.logger.log(`Successfully opted into campaign ${campaignId}`);

      return {
        success: true,
        message: 'Campaign completed successfully',
      };
    } catch (error) {
      this.logger.error(`Error opting into campaign ${campaignId}:`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      return {
        success: false,
        error: 'Failed to complete campaign',
      };
    }
  }

  async leaderBoardCampaign(sessionToken: string): Promise<LeaderBoardData | null> {
    try {
      if (!sessionToken) {
        throw new HttpException('Session token is required', HttpStatus.UNAUTHORIZED);
      }

      const response = await this.hg.v1.get<LeaderBoardData>(HeroGamingApiRoutes.leaderboardCampaigns, undefined, {
        Authorization: sessionToken,
      })

      this.logger.log(`Successfully fetched Leaderboard`);

      return response;
    } catch (error) {
      this.logger.error(`Error fetching Leaderboard data:`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      return null;
    }
  }
}
