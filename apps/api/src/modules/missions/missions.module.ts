import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { MissionsController } from './missions.controller';
import { MissionsService } from './missions.service';

@Module({
  imports: [SharedModule],
  controllers: [MissionsController],
  providers: [MissionsService],
})
export class MissionsModule {}
