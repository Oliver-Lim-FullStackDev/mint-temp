import { Module } from '@nestjs/common';
import { DropsController } from './drops.controller';

@Module({
  controllers: [DropsController],
})
export class DropsModule {}
