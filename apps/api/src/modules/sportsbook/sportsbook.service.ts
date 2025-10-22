import { Injectable, Logger } from '@nestjs/common';
import { HeroGamingApiRoutes } from 'src/shared/hero-gaming-api-routes';
import { HeroGamingClient } from 'src/shared/hero-gaming.client';
import { SportsbookAuth, SportsbookConfig } from './sportsbook.types';
import { SportsbookMapper } from './sportsbook.mapper';

@Injectable()
export class SportsbookService {
  private readonly logger = new Logger(SportsbookService.name);

  constructor(
    private readonly hg: HeroGamingClient,
  ) {}

  async config(): Promise<SportsbookConfig | undefined> {
    if (process.env.MINT_SPORTSBOOK_PROVIDER === 'betby') {
      return {
        scriptUrl: process.env.BETBY_SCRIPT_URL!,
        brandId: process.env.BETBY_BRAND_ID!,
        themeName: process.env.BETBY_THEME_NAME!,
      };
    }
  }

  async auth(): Promise<SportsbookAuth | undefined>  {
    if (process.env.MINT_SPORTSBOOK_PROVIDER === 'betby') {
      try {
        const response = await this.hg.v1.get<SportsbookAuth>(HeroGamingApiRoutes.my.betby);
        return SportsbookMapper.fromApi(response);
      } catch (error) {
        this.logger.error('Error in sportsbook auth:', error);
        throw new Error('Failed to auth sportsbook');
      }
    }
  }
}
