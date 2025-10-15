import type { Request } from 'express';

import {
  GameBridge,
  GameDefinition,
  GameStudioError,
  InsufficientBalanceError,
  MintSlotsRuntime,
  GameInitResponse,
  GamePlayResponse,
  PaymentsAdapter,
  PlayerProvider,
  PlayerUnauthorizedError,
  RandomnessStrategy,
  mintySpinsConfig,
  SlotGameConfig,
  SlotPlayResult,
  SlotGameEngine,
} from '@mint/game-internal';
import { Injectable, ForbiddenException, Inject, Scope, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ProvablyFairService } from '../../provably-fair/pf.service';
import { SuiVrfService } from '../../provably-fair/sui-vrf.service';
import { WalletService } from '../../wallet/wallet.service';
import { SessionService } from '../../session/session.service';
import type { Currency } from '../../wallet/dto/currency.dto';

@Injectable({ scope: Scope.REQUEST })
export class SlotGameService {
  private readonly bridge: GameBridge<Request, SlotGameConfig>;
  private readonly runtime: MintSlotsRuntime<Request>;
  private readonly definition: GameDefinition<SlotGameConfig> = {
    studioId: 'mint',
    gameId: 'minty-spins',
    config: mintySpinsConfig,
  };

  constructor(
    private readonly pfService: ProvablyFairService,
    private readonly vrfService: SuiVrfService,
    private readonly wallet: WalletService,
    private readonly sessionService: SessionService,
    @Inject(REQUEST) private readonly req: Request,
  ) {
    const playerProvider: PlayerProvider<Request> = {
      resolve: async () => {
        const session = await this.sessionService.getSessionFromRequest();
        const sessionId = session?.token;
        const playerId = session?.player?.id?.toString();
        if (!sessionId || !playerId) {
          throw new PlayerUnauthorizedError();
        }
        return { sessionId, playerId };
      },
    };

    const mapCurrency = (value: string): Currency => value as Currency;
    const payments: PaymentsAdapter = {
      balance: async ({ player, currency }) =>
        this.wallet.balance({ sessionId: player.sessionId, currency: mapCurrency(currency) }),
      debit: async ({ player, currency, amount, transactionId, roundId, gameId }) => {
        await this.wallet.debit({
          sessionId: player.sessionId,
          currency: mapCurrency(currency),
          amount,
          transactionId,
          roundId,
          gameId,
        });
      },
      credit: async ({ player, currency, amount, transactionId, roundId, gameId }) => {
        await this.wallet.credit({
          sessionId: player.sessionId,
          currency: mapCurrency(currency),
          amount,
          transactionId,
          roundId,
          gameId,
        });
      },
    };

    const randomness: RandomnessStrategy<Request> = new ProvablyFairRandomnessStrategy(this.pfService);

    this.bridge = new GameBridge<Request, SlotGameConfig>({
      definition: this.definition,
      playerProvider,
      payments,
    });

    this.runtime = new MintSlotsRuntime<Request>({
      bridge: this.bridge,
      randomness,
      engine: {
        play: async (config, rng) => {
          const slotEngine = new SlotGameEngine({ config, rng }, {});
          return slotEngine.play();
        },
      },
    });
  }

  async init(studioId: string, gameId: string): Promise<GameInitResponse<SlotGameConfig>> {
    try {
      return await this.runtime.init({
        studioId,
        gameId,
        request: this.req,
        currency: this.definition.config?.currency ?? 'SPN',
      });
    } catch (err) {
      throw this.mapError(err);
    }
  }

  async getConfig(studioId: string, gameId: string) {
    try {
      if (studioId !== this.definition.studioId || gameId !== this.definition.gameId) {
        throw new NotFoundException('Game not found');
      }
      return this.definition.config;
    } catch (err) {
      throw this.mapError(err);
    }
  }

  async play(
    studioId: string,
    gameId: string,
    dto: { clientSeed?: string; wager?: number },
  ): Promise<GamePlayResponse<SlotPlayResult>> {
    try {
      return await this.runtime.play({
        clientSeed: dto.clientSeed,
        wager: dto.wager ?? 0,
        studioId,
        gameId,
        request: this.req,
      });
    } catch (err) {
      throw this.mapError(err);
    }
  }

  async getPlayer(playerId: string) {
    const session = await this.sessionService.getSessionFromRequest();
    const sessionId = session?.token;
    const currentPlayerId = session?.player?.id?.toString();

    if (!sessionId || !currentPlayerId) {
      throw new ForbiddenException('Missing player session');
    }

    if (currentPlayerId !== playerId) {
      throw new ForbiddenException('Player access denied');
    }

    const balance = await this.wallet.balance({
      sessionId,
      currency: (this.definition.config?.currency ?? 'SPN') as Currency,
    });

    return {
      id: currentPlayerId,
      sessionId,
      balances: {
        [(this.definition.config?.currency ?? 'SPN') as Currency]: balance.balance,
      },
    };
  }

  private mapError(err: unknown) {
    if (err instanceof InsufficientBalanceError) {
      return new ForbiddenException(err.message);
    }

    if (err instanceof GameStudioError) {
      if (err.code === 'UNSUPPORTED_GAME') {
        return new NotFoundException(err.message);
      }
      if (err.code === 'PLAYER_UNAUTHORIZED') {
        return new ForbiddenException(err.message);
      }
    }

    if (err instanceof Error) {
      return err;
    }

    return new Error('Unknown game error');
  }
}

class ProvablyFairRandomnessStrategy implements RandomnessStrategy<Request> {
  readonly type = 'PF';
  readonly config = { type: 'PF' as const };

  constructor(private readonly pfService: ProvablyFairService) {}

  async commit(player: { playerId: string }, _request: Request) {
    const hash = this.pfService.commitServerSeed(player.playerId);
    return { hash };
  }

  async prepareSpin(player: { playerId: string }, _request: Request, clientSeed?: string) {
    const serverSeed = this.pfService.useCommittedSeed(player.playerId);
    const resolvedClientSeed = clientSeed ?? this.pfService.generateClientSeed();
    const combinedSeed = this.pfService.combineSeeds(serverSeed, resolvedClientSeed);
    const rng = this.pfService.createDeterministicRNG(combinedSeed);
    const nextHash = this.pfService.commitServerSeed(player.playerId);

    return {
      serverSeed,
      clientSeed: resolvedClientSeed,
      combinedSeed,
      rng,
      nextHash,
    };
  }
}
