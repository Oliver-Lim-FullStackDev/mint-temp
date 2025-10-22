import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { TonConversionService } from '../conversion/ton-conversion.service';
import { StarsConversionService } from '../conversion/stars-conversion.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [StoreController],
  providers: [StoreService, TonConversionService, StarsConversionService],
  exports: [StoreService],
})
export class StoreModule {}
