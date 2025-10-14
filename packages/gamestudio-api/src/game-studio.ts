import { PlayerUnauthorizedError, UnsupportedGameError } from './errors';
import type { GameDefinition, PlayerContext } from './modules/config';
import type { GameInitRequest, GameInitResponse } from './modules/init';
import type {
  BalanceRequest,
  BalanceResponse,
  PaymentsAdapter,
  PaymentRequest,
} from './modules/payments';
import type { PlayerProvider, PlayerQuery } from './modules/player';

export interface GameStudioApiOptions<RequestContext = unknown, Config = unknown> {
  definition: GameDefinition<Config>;
  playerProvider: PlayerProvider<RequestContext>;
  payments: PaymentsAdapter;
}

export class GameStudioApi<RequestContext = unknown, Config = unknown> {
  constructor(private readonly options: GameStudioApiOptions<RequestContext, Config>) {}

  async init(
    request: GameInitRequest<RequestContext>,
  ): Promise<GameInitResponse<Config>> {
    const player = await this.getPlayer(request);
    const balance = await this.getBalance({
      player,
      currency: request.currency,
    });

    return {
      config: this.options.definition.config,
      balances: { [request.currency]: balance.balance },
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
