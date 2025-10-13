import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { GamesService } from './games.service';
import { Game } from './games.types';
import { GameSearchDto } from './games.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly service: GamesService) {}

  @Post('search')
  search(@Body() dto: GameSearchDto) {
    const tags = dto.tags ?? [];
    const limit = dto.limit ?? 20;

    return this.service.search({ tags, limit });
  }

  @Get('all')
  findAll(): Promise<Game[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Game> {
    return this.service.findOne(id);
  }
}
