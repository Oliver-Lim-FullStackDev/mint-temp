import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { HeroGamingApiRoutes } from '../../shared/hero-gaming-api-routes';
import { errorHandler } from '../auth/lib/fn-errors';
import { extractClientType, extractIpAddress } from '../auth/lib/fn-validators';

/**
 * Initializes once when the application starts
 */
@Injectable()
export class TokenService {
  private readonly baseUrl: string;

  constructor(@Inject(REQUEST) private readonly request: Request) {
    this.baseUrl = process.env.HEROGAMING_API_URL!;
    console.log('TokenService: Constructor called - Service instantiated');
  }

  // TODO get token (move from herogaming api)

  // TODO refresh token logic
}
