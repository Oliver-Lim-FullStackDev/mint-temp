import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Shared
import { ProviderFactory } from './shared/provider-factory';

// On-ramp
import { CryptoOnrampController } from './on-ramp/crypto/crypto-onramp.controller';
import { CryptoOnrampService } from './on-ramp/crypto/crypto-onramp.service';

// Exchange
import { ExchangeController } from './exchange/exchange.controller';
import { ExchangeService } from './exchange/exchange.service';

// Existing modules (for conversion services)
import { ConversionModule } from 'src/modules/conversion/conversion.module';

// Transaction module for HG integration
import { TransactionModule } from 'src/modules/transaction/transaction.module';

@Module({
  imports: [
    ConfigModule,
    ConversionModule, // For TonConversionService and StarsConversionService
    TransactionModule, // For TransactionService
  ],
  controllers: [
    // On-ramp
    CryptoOnrampController,

    // Exchange
    ExchangeController,
  ],
  providers: [
    // Shared
    ProviderFactory,

    // On-ramp
    CryptoOnrampService,

    // Exchange
    ExchangeService,
  ],
  exports: [
    ProviderFactory,
    CryptoOnrampService,
    ExchangeService,
  ],
})
export class PaymentsModule {}
