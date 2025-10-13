import { Module } from '@nestjs/common';
import { SlotGameService } from './slot-game.service';
import { SlotGameController } from './slot-game.controller';
import { ProvablyFairService } from '../../provably-fair/pf.service';
import { SuiVrfService } from '../../provably-fair/sui-vrf.service';
import { WalletService } from '../../wallet/wallet.service';
import { HeroGamingWalletProvider } from '../../wallet/providers/hero-gaming-wallet.provider';
import { SessionService } from '../../session/session.service';
import { HeroGamingClient } from '../../../shared/hero-gaming.client';

@Module({
  controllers: [SlotGameController],
  providers: [
    SlotGameService,
    ProvablyFairService,
    SuiVrfService,
    WalletService,
    HeroGamingWalletProvider,
    SessionService,
    HeroGamingClient,
  ],
})
export class SlotGameModule {}
