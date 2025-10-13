import { Module } from '@nestjs/common';
import { SessionService } from '../session';
import { WalletService } from './wallet.service';
import { HeroGamingWalletProvider } from './providers/hero-gaming-wallet.provider';
import { WalletAddressesModule } from '../wallet-addresses/wallet-addresses.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [WalletAddressesModule, SharedModule],
  controllers: [],
  providers: [HeroGamingWalletProvider, WalletService, SessionService],
  exports: [WalletService],
})
export class WalletModule {}
