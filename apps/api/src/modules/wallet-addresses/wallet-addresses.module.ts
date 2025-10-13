import { Module } from '@nestjs/common';
import { WalletAddressesService } from './wallet-addresses.service';
import { SharedModule } from 'src/shared/shared.module';
import { SessionModule } from 'src/modules/session/session.module';

@Module({
  imports: [SharedModule, SessionModule],
  providers: [WalletAddressesService],
  controllers: [],
  exports: [WalletAddressesService],
})
export class WalletAddressesModule {}
