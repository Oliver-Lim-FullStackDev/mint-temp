import {
  PlayerUnauthorizedError,
  UnsupportedGameError,
} from '../errors';
import type {
  BalanceRequest,
  BalanceResponse,
  GameDefinition,
  PaymentRequest,
  PaymentsAdapter,
  PlayerContext,
  PlayerProvider,
  PlayerQuery,
} from './types';

export interface GameBridgeOptions<RequestContext = unknown, Config = unknown> {
  definition: GameDefinition<Config>;
  playerProvider: PlayerProvider<RequestContext>;
  payments: PaymentsAdapter;
}

export class GameBridge<RequestContext = unknown, Config = unknown> {
  constructor(private readonly options: GameBridgeOptions<RequestContext, Config>) {}

  async init(
    request: PlayerQuery<RequestContext> & { currency: string },
  ): Promise<{ config: Config | undefined; balance: BalanceResponse }> {
    const player = await this.getPlayer(request);
    const balance = await this.getBalance({
      player,
      currency: request.currency,
    });

    return {
      config: this.options.definition.config,
      balance,
    };
  }

  getConfig(query: PlayerQuery<RequestContext>): Config | undefined {
    this.ensureGame(query);
    return this.options.definition.config;
  }

  async getPlayer(query: PlayerQuery<RequestContext>): Promise<PlayerContext> {
    this.ensureGame(query);
    return this.resolvePlayer(query.request);
  }

  async getBalance(request: BalanceRequest): Promise<BalanceResponse> {
    return this.options.payments.balance(request);
  }

  async debit(request: PaymentRequest): Promise<void> {
    await this.options.payments.debit(request);
  }

  async credit(request: PaymentRequest): Promise<void> {
    await this.options.payments.credit(request);
  }

  get definition(): GameDefinition<Config> {
    return this.options.definition;
  }

  private ensureGame(query: PlayerQuery<RequestContext>) {
    if (
      query.studioId !== this.options.definition.studioId ||
      query.gameId !== this.options.definition.gameId
    ) {
      throw new UnsupportedGameError();
    }
  }

  private async resolvePlayer(request: RequestContext): Promise<PlayerContext> {
    const player = await this.options.playerProvider.resolve(request);
    if (!player?.playerId || !player?.sessionId) {
      throw new PlayerUnauthorizedError();
    }
    return player;
  }
}
