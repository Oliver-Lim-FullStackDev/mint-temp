import { Controller, Get, Post, Req, Body } from '@nestjs/common';
import { Request } from 'express';
import { Campaign } from './missions.types';
import { MissionsService } from './missions.service';
import { OptInCampaignDto } from './missions.dto';

@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Get()
  async findAll(@Req() req: Request): Promise<Campaign[]> {
    const sessionToken = req.headers.authorization || req.cookies['mint-session'];
    return this.missionsService.findAll(sessionToken);
  }

  @Post('opt-in')
  async optInCampaign(@Req() req: Request, @Body() dto: OptInCampaignDto) {
    const sessionToken = req.headers.authorization || req.cookies['mint-session'];
    if (!sessionToken) {
      throw new Error('Session token is required');
    }
    return this.missionsService.optInCampaign(sessionToken, dto.campaign_id);
  }

  @Get('rankings')
  async getRankings(@Req() req: Request) {
    const sessionToken = req.headers.authorization || req.cookies['mint-session'];
    if (!sessionToken) {
      throw new Error('Session token is required');
    }
    return this.missionsService.leaderBoardCampaign(sessionToken);
  }
}
