import type { Request } from 'express';
import { SlotGameConfig, SlotGameResult } from './slot-game.types';

import { Injectable, ForbiddenException, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ProvablyFairService } from '../../provably-fair/pf.service';
import { SuiVrfService } from '../../provably-fair/sui-vrf.service';
import { WalletService } from '../../wallet/wallet.service';
import { SessionService } from '../../session/session.service';
import { SlotGameEngine } from './slot-game.engine';
import {
  SlotGameInitDto,
  SlotGameRequestDto,
  SlotGameResultDto,
} from './slot-game.dto';
import { slotGameConfig } from './slot-game.config';


@Injectable({ scope: Scope.REQUEST })
export class SlotGameService {
  private sessionId!: string;
  private userId!: string;
  private readonly config: SlotGameConfig = slotGameConfig;

  constructor(
    private readonly pfService: ProvablyFairService,
    private readonly vrfService: SuiVrfService,
    private readonly wallet: WalletService,
    private readonly sessionService: SessionService,
    @Inject(REQUEST) private readonly req: Request,
  ) {}

  async init(): Promise<SlotGameInitDto> {
    await this.setSession();

    // fetch balance
    const spnBalance = await this.wallet.balance({
      sessionId: this.sessionId,
      currency: 'SPN',
    });

    const hash = this.pfService.commitServerSeed(this.userId);

    return {
      balances: {
        SPN: spnBalance.balance,
      },
      config: this.config,
      pf: { hash },
    };
  }

  async getConfig() {
    return this.config;
  }

  async setSession() {
    const session = await this.sessionService.getSessionFromRequest();
    const sessionId = session?.token;
    const userId = session?.player?.id?.toString();
    if (!sessionId || !userId) throw new ForbiddenException();

    this.sessionId = sessionId;
    this.userId = userId;
  }

  async getBalance() {
    const spins = await this.wallet.balance({
      sessionId: this.sessionId,
      currency: 'SPN',
    });
    return spins;
  }

  async play(dto: SlotGameRequestDto): Promise<SlotGameResultDto> {
    // check for valid session on every play
    await this.setSession();

    let spinBalance = await this.getBalance();
    if (spinBalance.balance < 1) {
      throw new ForbiddenException('No free spins left');
    }

    // create a random  transactionId
    const transactionId = Number(`${Date.now()}${Math.floor(Math.random() * 1_000)}`);
    const roundId = 1; // always set to 1 round per spin for our slots

    // debit 1 SPN
    await this.wallet.debit({
      sessionId: this.sessionId,
      currency: 'SPN',
      amount: 1,
      transactionId,
      roundId,
      gameId: 'mint_super_slots',
      // context: { gameId: 'minty-spins' },
    });

    // provably-fair
    let rng: () => number;
    let pf: SlotGameResultDto['pf'];
    if (this.config.pfStrategy === 'web2') {
      const serverSeed = this.pfService.generateServerSeed();
      const clientSeed = dto.clientSeed ?? this.pfService.generateClientSeed();
      const combinedSeed = this.pfService.combineSeeds(serverSeed, clientSeed);
      rng = this.pfService.createDeterministicRNG(combinedSeed);
      pf = { type: 'web2', serverSeed, clientSeed, combinedSeed };
    } else {
      const { seed, proof } = this.vrfService.generateSeed();
      rng = this.pfService.createDeterministicRNG(seed);
      pf = { type: 'vrf', seed, proof };
    }

    // run engine
    const engine = new SlotGameEngine({ config: this.config, rng }, {});
    const spinResult: SlotGameResult = await engine.play();

    // credit WinCombos
    let rewards: SlotGameResultDto['result']['rewards'] = null;
    if (spinResult.isWin) {
      rewards = await this.settle(spinResult, transactionId, roundId);
    }

    // update balance
    const spinBalanceAfter = await this.getBalance();

    // commit next server seed and return DTO
    const hash = this.pfService.commitServerSeed(this.userId);

    return {
      result: {
        data: spinResult.data,
        isWin: spinResult.isWin,
        payout: spinResult.payout, // this is the slot's main currency, the total SPN payout (not rewarded currently)
        winningCombinations: spinResult.winningCombinations,
        hasJackpot: spinResult.hasJackpot,
        spinsRemaining: spinBalanceAfter.balance,
        credits: 0,
        rewards,
      },
      wager: 0,
      balance: { before: spinBalance.balance, after: spinBalanceAfter.balance },
      pf,
      timestamp: new Date().toISOString(),
    };
  }

  // Helper to write a 0-debit and then the win credit
  settle = async (spinResult: SlotGameResult, transactionId: number, roundId: number) => {
    const { winningCombinations } = spinResult;

    // 1st look for SPN to credit back
    // then for all other wins we do a debit=0,
    // then credit each reward separately keeping the same transactionId and roundId
    /*
    SPN - we don't reward SPN yet, this code would enable it
    await this.wallet.credit({
      sessionId: this.sessionId,
      currency: 'SPN',
      amount: 1,
      transactionId,
      roundId: 1,
      gameId: 'mint_super_slots',
    });*/
    // === MBX / XPP / RTP rewards (derived from result.winningCombinations) ===
    const { payouts } = this.config;
    const baseRewards = payouts.rewards; // per-symbol base rewards: { [symbol]: { MBX, SPN, XPP, RTP } }


    const earned: SlotGameResultDto['result']['rewards'] = { MBX: 0, XPP: 0, RTP: 0 };

    const getPatternMultiplier = (wc: typeof winningCombinations[number]): number => {
      // 1) trust the engine if it provided it
      const m = (wc as any).multiplier;
      if (m != null) return Number(m) || 1;

      // 2) fallback (keeps backward compatibility)
      if (!payouts.enableMatchMultipliers) return 1;
      if (wc.type === 'horizontal') return payouts.horizontalMatches[wc.count] ?? 1;
      if (wc.type === 'diagonal-right' || wc.type === 'diagonal-left') {
        return payouts.diagonalMatches[wc.count] ?? 1;
      }

      // Specials (symbolCount)
      // Prefer config overrides, else default to actualCount as the multiplier.
      const bySymbol =
        (payouts as any).symbolCountMultipliersBySymbol?.[wc.symbol]?.[(wc as any).actualCount];
      if (bySymbol != null) return bySymbol;

      const generic = (payouts as any).symbolCountMultipliers?.[(wc as any).actualCount];
      if (generic != null) return generic;

      return Math.max(1, Number((wc as any).actualCount ?? wc.count) || 1);
    };

    for (const wc of winningCombinations) {
      const base = baseRewards[wc.symbol as keyof typeof baseRewards];
      if (!base) continue;

      const multiplier = getPatternMultiplier(wc);

      // Accumulate per-currency; SPN is intentionally ignored for payouts here
      earned.MBX += Math.trunc((base.MBX ?? 0) * multiplier);
      earned.XPP += Math.trunc((base.XPP ?? 0) * multiplier);
      earned.RTP += Math.trunc((base.RTP ?? 0) * multiplier);
    }

    if (earned.MBX) {
      await this.payout({
        amount: earned.MBX,
        currency: 'MBX',
        transactionId,
        roundId,
      });
    }
    if (earned.XPP) {
      await this.payout({
        amount: earned.XPP,
        currency: 'XPP',
        transactionId,
        roundId,
      });
    }
    if (earned.RTP) {
      await this.payout({
        amount: earned.RTP,
        currency: 'RTP',
        transactionId,
        roundId,
      });
    }

    // Jackpot logic is set to 0 in config, hence disabled
    // if (payouts.jackpot?.payout && spinResult.hasJackpot) {
    //   earned.MBX += Number(payouts.jackpot.payout) || 0;
    // }

    return earned;
  }

  payout = async (win) => {
    if (!win?.amount) return;

    // 0 debit for audit trail (idempotent/no-op on balance)
    await this.wallet.debit({
      ...win,
      amount: 0,
      gameId: this.config.gameId,
      sessionId: this.sessionId,
    });

    await this.wallet.credit({
      ...win,
      gameId: this.config.gameId,
      sessionId: this.sessionId,
    });
  }
}
