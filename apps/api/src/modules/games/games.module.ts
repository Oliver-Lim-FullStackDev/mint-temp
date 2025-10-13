import { Module } from '@nestjs/common';
import { HeroGamingClient } from 'src/shared/hero-gaming.client';
import { SessionModule } from '../session/session.module';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SessionModule, SharedModule],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
