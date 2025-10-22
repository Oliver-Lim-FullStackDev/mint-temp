import { GameBridge } from '../../bridge';
import type {
  PaymentRequest,
  PlayerContext,
} from '../../bridge';
import { InsufficientBalanceError, UnsupportedGameError } from '../../errors';
import type { GamePlayRequest, GamePlayResponse } from '../../play';
import type { GameInitRequest, GameInitResponse } from '../../init';
import type { RandomnessStrategy } from '../../randomness';
import type { GameEngineAdapter } from '../types';
import type {
  SlotGameConfig,
  SlotGameResult,
  SlotPlayResult,
  SlotRewards,
  WinningCombination,
} from './types';

export interface MintSlotsRuntimeOptions<RequestContext = unknown> {
  bridge: GameBridge<RequestContext, SlotGameConfig>;
  randomness: RandomnessStrategy<RequestContext>;
  engine: GameEngineAdapter<SlotGameConfig, SlotGameResult>;
}

export class MintSlotsRuntime<RequestContext = unknown> {
  constructor(private readonly options: MintSlotsRuntimeOptions<RequestContext>) {}

  async init(
    request: GameInitRequest<RequestContext>,
  ): Promise<GameInitResponse<SlotGameConfig>> {
    this.ensureGame(request);
    const player = await this.options.bridge.getPlayer(request);
    const balance = await this.options.bridge.getBalance({
      player,
      currency: request.currency,
    });

    const commitment = await this.options.randomness.commit(
      player,
      request.request,
    );
    const config = this.requireConfig();
    const randomnessConfig = config.randomness ?? this.options.randomness.config;
    const randomness = {
      type: randomnessConfig?.type ?? this.options.randomness.type,
      hash: commitment.hash,
      meta: randomnessConfig?.meta ?? this.options.randomness.config?.meta,
    } as const;

    return {
      config,
      balances: { [request.currency]: balance.balance },
      randomness,
      pf: randomness,
    };
  }

  async play(
    request: GamePlayRequest<RequestContext>,
  ): Promise<GamePlayResponse<SlotPlayResult>> {
    this.ensureGame(request);
    const player = await this.options.bridge.getPlayer(request);
    const config = this.requireConfig();

    const balanceBefore = await this.options.bridge.getBalance({
      player,
      currency: config.currency,
    });

    if (balanceBefore.balance < config.spinCost) {
      throw new InsufficientBalanceError('No free spins left');
    }

    const transactionId = this.generateTransactionId();
    const roundId = 1;

    await this.options.bridge.debit({
      player,
      currency: config.currency,
      amount: config.spinCost,
      transactionId,
      roundId,
      gameId: config.gameId,
    });

    const randomness = await this.options.randomness.prepareSpin(
      player,
      request.request,
      request.clientSeed,
    );

    const gameResult = await this.options.engine.play(config, randomness.rng);

    let rewards: SlotPlayResult['rewards'] = null;
    if (gameResult.isWin) {
      rewards = await this.settleRewards(
        player,
        gameResult.winningCombinations,
        transactionId,
        roundId,
      );
    }

    const balanceAfter = await this.options.bridge.getBalance({
      player,
      currency: config.currency,
    });

    const randomnessType = config.randomness?.type ?? this.options.randomness.type;
    const randomnessPayload = {
      type: randomnessType,
      serverSeed: randomness.serverSeed,
      clientSeed: randomness.clientSeed,
      combinedSeed: randomness.combinedSeed,
      hash: randomness.nextHash,
    } as const;

    return {
      result: {
        data: gameResult.data,
        isWin: gameResult.isWin,
        payout: gameResult.payout,
        winningCombinations: gameResult.winningCombinations,
        hasJackpot: gameResult.hasJackpot,
        spinsRemaining: balanceAfter.balance,
        credits: 0,
        rewards,
      },
      wager: request.wager,
      balance: {
        before: balanceBefore.balance,
        after: balanceAfter.balance,
      },
      randomness: randomnessPayload,
      pf: randomnessPayload,
      timestamp: new Date().toISOString(),
    };
  }

  private ensureGame(query: { studioId: string; gameId: string }) {
    const definition = this.options.bridge.definition;
    if (
      query.studioId !== definition.studioId ||
      query.gameId !== definition.gameId
    ) {
      throw new UnsupportedGameError();
    }
  }

  private requireConfig(): SlotGameConfig {
    const config = this.options.bridge.definition.config;
    if (!config) {
      throw new UnsupportedGameError('Game configuration unavailable');
    }
    return config;
  }

  private async settleRewards(
    player: PlayerContext,
    winningCombinations: WinningCombination[],
    transactionId: number,
    roundId: number,
  ): Promise<SlotRewards> {
    const config = this.requireConfig();
    const payouts = config.payouts;
    const baseRewards = payouts.rewards;

    const earned: SlotRewards = { MBX: 0, XPP: 0, RTP: 0 };

    const getPatternMultiplier = (wc: WinningCombination): number => {
      const provided = (wc as any).multiplier;
      if (provided != null) return Number(provided) || 1;

      if (!payouts.enableMatchMultipliers) return 1;
      if (wc.type === 'horizontal')
        return payouts.horizontalMatches?.[wc.count] ?? 1;
      if (wc.type === 'diagonal-right' || wc.type === 'diagonal-left') {
        return payouts.diagonalMatches?.[wc.count] ?? 1;
      }

      const bySymbol = (payouts as any).symbolCountMultipliersBySymbol?.[
        wc.symbol
      ]?.[(wc as any).actualCount];
      if (bySymbol != null) return bySymbol;

      const generic = (payouts as any).symbolCountMultipliers?.[
        (wc as any).actualCount
      ];
      if (generic != null) return generic;

      return Math.max(1, Number((wc as any).actualCount ?? wc.count) || 1);
    };

    for (const wc of winningCombinations) {
      const base = baseRewards?.[wc.symbol as keyof typeof baseRewards];
      if (!base) continue;

      const multiplier = getPatternMultiplier(wc);
      earned.MBX += Math.trunc((base.MBX ?? 0) * multiplier);
      earned.XPP += Math.trunc((base.XPP ?? 0) * multiplier);
      earned.RTP += Math.trunc((base.RTP ?? 0) * multiplier);
    }

    const payoutsToProcess: Array<[keyof typeof earned, number]> = [
      ['MBX', earned.MBX],
      ['XPP', earned.XPP],
      ['RTP', earned.RTP],
    ];

    for (const [currency, amount] of payoutsToProcess) {
      if (!amount) continue;

      const payment: PaymentRequest = {
        player,
        currency: String(currency),
        amount,
        transactionId,
        roundId,
        gameId: config.gameId,
      };

      await this.options.bridge.debit({ ...payment, amount: 0 });
      await this.options.bridge.credit(payment);
    }

    return earned;
  }

  private generateTransactionId() {
    return Number(`${Date.now()}${Math.floor(Math.random() * 1_000)}`);
  }
}
