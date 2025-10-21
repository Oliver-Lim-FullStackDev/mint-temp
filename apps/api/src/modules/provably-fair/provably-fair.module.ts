import { Module } from '@nestjs/common';
import { ProvablyFairService } from './pf.service';

@Module({
  providers: [ProvablyFairService],
  exports: [ProvablyFairService],
})
export class ProvablyFairModule {}
