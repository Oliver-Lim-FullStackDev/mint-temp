import { Module } from '@nestjs/common';
import { ConversionController } from './conversion.controller';
import { TonConversionService } from './ton-conversion.service';
import { StarsConversionService } from './stars-conversion.service';

@Module({
  controllers: [ConversionController],
  providers: [TonConversionService, StarsConversionService],
  exports: [TonConversionService, StarsConversionService],
})
export class ConversionModule {}
