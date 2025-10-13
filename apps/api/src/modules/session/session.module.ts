import { Module } from '@nestjs/common';
import { HeroGamingClient } from 'src/shared/hero-gaming.client';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';

@Module({
  controllers: [SessionController],
  providers: [HeroGamingClient, SessionService],
  exports: [SessionService],
})
export class SessionModule {}
