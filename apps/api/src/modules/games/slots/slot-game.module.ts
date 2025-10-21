import { Module } from '@nestjs/common';
import { SlotGameService } from './slot-game.service';
import { GameStudioController } from './game-studio.controller';
import { ProvablyFairModule } from '../../provably-fair/provably-fair.module';
import { HeroGamingClient } from 'src/shared/hero-gaming.client';
import { WalletModule } from '../../wallet/wallet.module';
import { SessionModule } from '../../session/session.module';

@Module({
  controllers: [GameStudioController],
  imports: [ProvablyFairModule, WalletModule, SessionModule],
  providers: [SlotGameService, HeroGamingClient],
})
export class SlotGameModule {}
