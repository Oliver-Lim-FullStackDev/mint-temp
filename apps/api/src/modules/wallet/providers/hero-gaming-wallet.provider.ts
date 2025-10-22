import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Currency } from '../dto/currency.dto';
import { BalanceRequestDto, BalanceResponseDto } from '../dto/balance.dto';
import { DebitRequestDto, DebitResponseDto } from '../dto/debit.dto';
import { CreditRequestDto, CreditResponseDto } from '../dto/credit.dto';
import { HeroGamingClient } from 'src/shared/hero-gaming.client';
import { HeroGamingApiRoutes } from 'src/shared/hero-gaming-api-routes';
import { WalletProvider } from '../interfaces/wallet-provider.interface';
import { SessionService } from '../../session/session.service';

@Injectable()
export class HeroGamingWalletProvider implements WalletProvider {
  constructor(
    private readonly sessionService: SessionService,
    private readonly hg: HeroGamingClient,
  ) {}

  /**
   * Pulls session and returns session.player[`id_${currency}`]
   */
  private async resolveExternalId(currency: Currency): Promise<string> {
    const session = await this.sessionService.getSessionFromRequest();
    const externalPlayerId = `${session.player.internalId}_${currency}`;

    if (!externalPlayerId) {
      throw new UnauthorizedException(`Missing externalPlayerId for currency ${currency}`);
    }
    return externalPlayerId;
  }

  async balance(dto: BalanceRequestDto): Promise<BalanceResponseDto> {
    const externalPlayerId = await this.resolveExternalId(dto.currency);
    const data = await this.hg.vx.post<{ balance: string; currency: string; message: string }>(
      HeroGamingApiRoutes.mint.balance,
      { externalPlayerId },
      {
        Authorization: `Basic ${process.env.HEROGAMING_MINT_API_TOKEN}`,
        basicAuth: true,
      },
    );

    if (data.message) {
      throw new UnauthorizedException(data.message || 'Session could not be verified');
    }

    return {
      balance: Number(data.balance),
      currency: dto.currency,
    };
  }

  async debit(dto: DebitRequestDto): Promise<DebitResponseDto> {
    const externalPlayerId = await this.resolveExternalId(dto.currency);
    const payload = {
      ...dto,
      externalPlayerId,
      amount: String(dto.amount),
      currency: dto.currency,
      nr_of_rounds: 1,
      buyIn: true,
    };
    const data = await this.hg.vx.post<DebitResponseDto>(HeroGamingApiRoutes.mint.debit, payload, {
      Authorization: `Basic ${process.env.HEROGAMING_MINT_API_TOKEN}`,
      basicAuth: true,
    });
    return {
      balance: data.balance,
      currency: dto.currency,
    };
  }

  async credit(dto: CreditRequestDto): Promise<CreditResponseDto> {
    const externalPlayerId = await this.resolveExternalId(dto.currency);
    const payload = {
      ...dto,
      externalPlayerId,
      amount: String(dto.amount),
      currency: dto.currency,
    };
    const data = await this.hg.vx.post<CreditResponseDto>(HeroGamingApiRoutes.mint.credit, payload, {
      Authorization: `Basic ${process.env.HEROGAMING_MINT_API_TOKEN}`,
      basicAuth: true,
    });
    return {
      balance: data.balance,
      currency: dto.currency,
    };
  }
}
