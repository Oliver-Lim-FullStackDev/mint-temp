import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PartnersService } from '../services';
import { PartnerPlayerQueryDto, PartnerPlayerDto } from '../dto/';
import { PartnerAuthGuard } from '../guards';

@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  /**
   * GET /partners/:key/players
   *
   * Retrieves the list of players associated with a specific partner.
   *
   * Path parameter:
   *  - key: Partner key
   *
   * Query parameters (optional):
   *  - id: Filter by player ID
   *  - username: Filter by username
   *  - createdAtFrom: Filter players created from this date
   *  - createdAtTo: Filter players created up to this date
   *
   * This endpoint is protected by PartnerAuthGuard.
   */
  @Get(':key/players')
  @UseGuards(PartnerAuthGuard)
  async getPlayers(
    @Param('key') key: string,
    @Query() partnerPlayerQueryDto: PartnerPlayerQueryDto,
  ): Promise<PartnerPlayerDto[]> {
    return this.partnersService.fetchFromHero(key, partnerPlayerQueryDto);
  }
}
