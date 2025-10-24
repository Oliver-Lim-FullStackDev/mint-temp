import { Module } from '@nestjs/common';
import { CryptoAccountsController, FiatAccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
  controllers: [CryptoAccountsController, FiatAccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}

