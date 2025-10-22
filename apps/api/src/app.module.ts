import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { GamesModule } from './modules/games/games.module';
import { SlotGameModule } from './modules/games/minty-spins/slot-game.module';
import { SessionModule } from './modules/session/session.module';
import { TokenModule } from './modules/session/token.module';
import { StoreModule } from './modules/store/store.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { MissionsModule } from './modules/missions/missions.module';
import { DropsModule as DropsModule } from './modules/drops/drops.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ConversionModule } from './modules/conversion/conversion.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { PartnersModule } from './modules/partners/partners.module';
import { CmsModule } from './modules/cms/cms.module';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    AuthModule,
    DropsModule,
    GamesModule,
    InventoryModule,
    MissionsModule,
    SessionModule,
    SlotGameModule,
    StoreModule,
    WalletModule,
    TokenModule,
    ConversionModule,
    TransactionModule,
    PartnersModule,
    CmsModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
