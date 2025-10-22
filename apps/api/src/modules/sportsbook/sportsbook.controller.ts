import { Controller, Get, Param } from '@nestjs/common';
import { SportsbookService } from './sportsbook.service';
import { SportsbookAuth, SportsbookConfig } from './sportsbook.types';

@Controller('sportsbook')
export class SportsbookController {
  constructor(private readonly service: SportsbookService) {}

  @Get('config')
  async config(): Promise<SportsbookConfig | undefined> {
    return await this.service.config();
  }

  @Get('auth')
  async auth(): Promise<SportsbookAuth | undefined> {
    return await this.service.auth();
  }
}
