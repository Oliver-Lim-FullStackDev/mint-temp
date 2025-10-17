import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { GamesService } from './games.service';
import { Game, GameProvider } from './games.types';
import { GameSearchDto } from './games.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly service: GamesService) {}

  @Post('search')
  search(@Body() dto: GameSearchDto) {
    const tags = dto.tags ?? [];
    const limit = dto.limit ?? 20;

    return this.service.search({
      tags,
      limit,
      offset: dto.offset,
      search: dto.search,
      order: dto.order,
      provider: dto.provider,
      providers: dto.providers,
    });
  }

  @Get('all')
  findAll(): Promise<Game[]> {
    return this.service.findAll();
  }

  @Get('providers')
  findProviders(): Promise<GameProvider[]> {
    return this.service.findProviders();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Game> {
    return this.service.findOne(id);
  }
}
