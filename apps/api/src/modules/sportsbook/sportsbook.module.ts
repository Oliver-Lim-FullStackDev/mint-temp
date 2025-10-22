import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { SessionModule } from '../session/session.module';
import { SportsbookController } from './sportsbook.controller';
import { SportsbookService } from './sportsbook.service';

@Module({
  imports: [SessionModule, SharedModule],
  controllers: [SportsbookController],
  providers: [SportsbookService],
})
export class SportsbookModule {}
