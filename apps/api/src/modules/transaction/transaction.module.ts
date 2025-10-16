import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { ReceiptsController } from './receipts.controller';
import { TransactionService } from './transaction.service';
import { TonPurchaseService } from './ton-purchase.service';
import { StarsPurchaseService } from './stars-purchase.service';
import { ReceiptsService } from './receipts.service';
import { WalletAddressesModule } from '../wallet-addresses/wallet-addresses.module';
import { SessionModule } from '../session/session.module';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [WalletAddressesModule, SessionModule, SharedModule],
  controllers: [TransactionController, ReceiptsController],
  providers: [
    TransactionService,
    TonPurchaseService,
    StarsPurchaseService,
    ReceiptsService,
  ],
  exports: [
    TransactionService,
    TonPurchaseService,
    StarsPurchaseService,
    ReceiptsService,
  ],
})
export class TransactionModule {}
