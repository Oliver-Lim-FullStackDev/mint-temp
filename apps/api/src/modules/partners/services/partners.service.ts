import { Injectable, UnauthorizedException } from '@nestjs/common';

import { HeroGamingClient } from 'src/shared/hero-gaming.client';
import { errorHandler } from 'src/modules/auth/lib/fn-errors';
import { HeroPlayer, HeroPlayersResponse, HeroAccount } from 'src/shared/hero-gaming.types';
import { HeroGamingApiRoutes } from 'src/shared/hero-gaming-api-routes';

import { PartnerPlayerQueryDto, PartnerPlayerDto } from '../dto';

@Injectable()
export class PartnersService {
  constructor(private readonly hg: HeroGamingClient) {}

  async fetchFromHero(key: string, filters?: PartnerPlayerQueryDto): Promise<PartnerPlayerDto[]> {
    try {
      const query: Record<string, any> = { filter: { request_referrer: key } };

      // Mapping optional filters to query parameters
      if (filters?.id) query.filter.id = filters.id;
      if (filters?.username) query.filter.username = filters.username;
      if (filters?.createdAtFrom) query.filter.created_at_from = filters.createdAtFrom;
      if (filters?.createdAtTo) query.filter.created_at_to = filters.createdAtTo;
      if (filters?.page) query.page = filters.page;

      const response = await this.hg.vx.get<HeroPlayersResponse>(HeroGamingApiRoutes.admin.players, query, {
        Authorization: `Basic ${process.env.HEROGAMING_MINT_API_ADMIN_TOKEN}`,
        'Content-Type': 'application/json',
      });

      if (response?.errors) {
        throw new UnauthorizedException(response.errors[0].join(' '));
      }

      const rawPlayers = response.result || [];
      return this.mapToPartnerFormat(rawPlayers);
    } catch (err) {
      throw errorHandler(err, 'Hero Gaming API players fetch failed');
    }
  }

  private mapToPartnerFormat(rawPlayers: HeroPlayer[]): PartnerPlayerDto[] {
    return rawPlayers.map((player) => ({
      id: String(player.internalId ?? player.dealerId ?? player.mapsPlayerId),
      username: player.username ?? player.displayName ?? 'unknown',
      createdAt: player.createdAt,
      balances: {
        MBX: this.findBalance(player.all_accounts, 'MBX'),
        XP: this.findBalance(player.all_accounts, 'XP') || this.findBalance(player.all_accounts, 'XPP'),
        RTP: this.findBalance(player.all_accounts, 'RTP'),
        SPN: this.findBalance(player.all_accounts, 'SPN'),
      },
    }));
  }

  private findBalance(accounts: HeroAccount[] = [], currency: string): number {
    const account = accounts.find((a) => a.currency === currency);
    return account ? account.balanceCents / 100 : 0;
  }
}
