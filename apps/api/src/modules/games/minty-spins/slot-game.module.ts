import { Module } from '@nestjs/common';
import { HeroGamingClient } from 'src/shared/hero-gaming.client';
import { ProvablyFairModule } from '../../provably-fair/provably-fair.module';
import { WalletModule } from '../../wallet/wallet.module';
import { SessionModule } from '../../session/session.module';
import { SlotGameService } from './slot-game.service';
import { SlotGameController } from './slot-game.controller';

@Module({
  controllers: [SlotGameController],
  imports: [ProvablyFairModule, WalletModule, SessionModule],
  providers: [SlotGameService, HeroGamingClient],
})
export class SlotGameModule {}
