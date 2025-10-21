import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request, type Response as ExpressResponse } from 'express';
import { HeroGamingApiRoutes } from 'src/shared/hero-gaming-api-routes';
import { HeroGamingClient } from 'src/shared/hero-gaming.client';
import { HG_SessionResponse, SessionResponse, TonWalletLoginInput } from 'src/shared/hero-gaming.types';
import { errorHandler } from '../auth/lib/fn-errors';
import { extractClientType, extractIpAddress } from '../auth/lib/fn-validators';
import { SessionMapper } from './session.mapper';

@Injectable()
export class SessionService {
  private readonly baseUrl: string;

  constructor(
    private readonly hg: HeroGamingClient,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    this.baseUrl = process.env.HEROGAMING_API_URL!;
  }

  getSessionIdFromHeaders(): string | null {
    return this.request.headers.authorization || this.request.cookies['mint-session'];
  }

  /**
   * Extracts the session token from the incoming request's headers,
   * validates it, and returns the full HG_SessionResponse.
   * Throws UnauthorizedException if missing or invalid.
   */
  async getSessionFromRequest(): Promise<SessionResponse> {
    const auth = this.getSessionIdFromHeaders();
    if (!auth) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    // support "Bearer <token>" or raw token
    const token =
      typeof auth === 'string' && auth.startsWith('Bearer ')
        ? auth.slice(7)
        : Array.isArray(auth)
          ? auth[0]
          : (auth as string);

    if (!token) {
      throw new UnauthorizedException('Invalid Authorization header');
    }

    const session = await this.validateSession(token);
    if (!session) {
      throw new UnauthorizedException('Session invalid or expired');
    }

    return session;
  }

  /**
   * Authenticate with TON wallet using fetch
   * @param walletAddress - The wallet address object
   * @param referralId - Optional referralId
   * @param referrer - Optional referrer partner code
   * @returns Session token response
   */
  async tonWalletSession(
    walletAddress: TonWalletLoginInput,
    referralId?: string,
    referrer?: string,
  ): Promise<SessionResponse | null> {
    // Extract IP address and client type from request
    const ipAddress = extractIpAddress(this.request);
    const clientType = extractClientType(this.request);

    const tonRegisterPayload: Record<string, any> = {
      country_code: process.env.HEROGAMING_FRONTEND_COUNTRY_CODE || 'GB',
      ip_address: ipAddress,
      client_type: clientType,
      wallet_address: walletAddress,
      referred_by_id: referralId?.trim() || undefined,
      request_referrer: referrer?.trim() || undefined,
    };

    try {
      // Call the TON auth endpoint using fetch
      const response = await fetch(`${this.baseUrl}${HeroGamingApiRoutes.mint.tonAuth}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${process.env.HEROGAMING_MINT_API_TOKEN}`,
        },
        body: JSON.stringify(tonRegisterPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { session_token } = (await response.json()) as { session_token: string };
      const sessionData = await this.validateSession(session_token);

      return sessionData;
    } catch (err) {
      return errorHandler(err, 'Hero Gaming API TON auth failed');
    }
  }

  setSessionCookie(token, res: ExpressResponse): void {
    if (!token || !res.cookie) {
      return;
    }

    const COOKIE = 'mint-session';
    res.cookie(COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: `.${process.env.MINT_DOMAIN}`, // share between subdomains
    });
  }

  /**
   * Refresh session token (single call, no loops)
   * Returns { token, message? } or null on hard failure.
   */
  async refreshSession(token: string): Promise<{ token: string; message?: string } | null> {
    const endpoint = `${this.baseUrl}${HeroGamingApiRoutes.mint.refreshSession}`;
    try {
      const response = await this.hg.v1.post<{ token?: string; message?: string }>(
        endpoint,
        { token },
        {
          Authorization: `Basic ${process.env.HEROGAMING_MINT_API_TOKEN}`,
          'frontend-country-code': process.env.HEROGAMING_FRONTEND_COUNTRY_CODE || 'GB',
        },
      );

      // API can return { message } (keep old token) or { token } (new token)
      if (response?.message) {
        return { token, message: response.message };
      }
      if (response?.token) {
        Logger.log(`Session refreshed from ${token} to ${response?.token}`);
        return { token: response.token };
      }

      // Fallback: unknown shape → keep old token but signal
      return { token, message: 'Unknown response format' };
    } catch (err) {
      return errorHandler(err, 'Hero Gaming API session token refresh failed');
    }
  }

  /**
   * Validate existing session token.
   * On 401, tries ONE refresh and re-validates; otherwise throws.
   */
  async validateSession(sessionToken?: string, _retried = false): Promise<SessionResponse | null> {
    try {
      const response = await this.hg.v1.get<HG_SessionResponse>(HeroGamingApiRoutes.session, undefined, {
        authorization: sessionToken,
      });

      return SessionMapper.fromApi(response);
    } catch (err: any) {
      const code = err?.status ?? err?.statusCode ?? err?.response?.status;
      const is401 = code === 401 || /401|unauthoriz/i.test(String(err?.message || ''));

      // Only one retry: refresh token then re-validate
      if (is401 && !_retried && sessionToken) {
        const refreshed = await this.refreshSession(sessionToken);

        // If refresh failed hard → stop
        if (!refreshed) {
          throw new UnauthorizedException('Session refresh failed');
        }

        // If API replied with a message but did not rotate token → stop (someone messed with token)
        if (refreshed.message && refreshed.token === sessionToken) {
          throw new UnauthorizedException(refreshed.message || 'Session invalid or expired');
        }

        // Retry once with the new token (or same if API decided so)
        return this.validateSession(refreshed.token, true);
      }

      // Non-401 or already retried → stop
      throw new UnauthorizedException('Session Error', `${sessionToken ?? '(no token)'} ${err?.message ?? err}`);
    }
  }
}
