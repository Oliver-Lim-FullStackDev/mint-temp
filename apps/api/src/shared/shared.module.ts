import { Module } from '@nestjs/common';
import { HeroGamingClient } from './hero-gaming.client';
import { SessionModule } from '../modules/session/session.module';

@Module({
  imports: [SessionModule],
  providers: [HeroGamingClient],
  exports: [HeroGamingClient],
})
export class SharedModule {}
