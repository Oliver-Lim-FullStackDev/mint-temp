import { GameBridge, type GameBridgeOptions } from '@mint/game-internal';
import type { GameDefinition } from './modules/config';
import type { GameStudioInitRequest, GameStudioInitResponse } from './modules/init';
import type { BalanceRequest, BalanceResponse, PaymentRequest } from './modules/payments';
import type { PlayerContext, PlayerQuery } from './modules/player';

export type GameStudioApiOptions<RequestContext = unknown, Config = unknown> = GameBridgeOptions<
  RequestContext,
  Config
>;

export class GameStudioApi<RequestContext = unknown, Config = unknown> {
  private readonly bridge: GameBridge<RequestContext, Config>;

  constructor(options: GameStudioApiOptions<RequestContext, Config>) {
    this.bridge = new GameBridge(options);
  }

  async init(
    request: GameStudioInitRequest<RequestContext>,
  ): Promise<GameStudioInitResponse<Config>> {
    const { config, balance } = await this.bridge.init(request);

    return {
      config,
      balances: { [request.currency]: balance.balance },
    };
  }

  getConfig(query: PlayerQuery<RequestContext>): Config | undefined {
    return this.bridge.getConfig(query);
  }

  async getPlayer(query: PlayerQuery<RequestContext>): Promise<PlayerContext> {
    return this.bridge.getPlayer(query);
  }

  async getBalance(request: BalanceRequest): Promise<BalanceResponse> {
    return this.bridge.getBalance(request);
  }

  async debit(request: PaymentRequest): Promise<void> {
    await this.bridge.debit(request);
  }

  async credit(request: PaymentRequest): Promise<void> {
    await this.bridge.credit(request);
  }

  get definition(): GameDefinition<Config> {
    return this.bridge.definition;
  }
}
