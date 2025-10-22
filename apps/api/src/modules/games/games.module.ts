import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { SessionModule } from '../session/session.module';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';

@Module({
  imports: [SessionModule, SharedModule],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
