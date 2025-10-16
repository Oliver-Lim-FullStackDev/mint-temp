import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SlotGameService } from './slot-game.service';
import { SlotGameInitDto, SlotGameRequestDto, SlotGameResultDto } from './slot-game.dto';
import { SlotGameConfig } from './slot-game.types';

@Controller('games/minty-spins')
export class SlotGameController {
  constructor(private readonly slotService: SlotGameService) {}

  @Get('')
  info(): void {}

  @Get('init')
  async init(): Promise<SlotGameInitDto> {
    return await this.slotService.init();
  }

  @Get('config')
  getConfig(): Promise<SlotGameConfig> {
    return this.slotService.getConfig();
  }

  // @Post('play/:userId')
  @Post('play')
  play(@Param('userId') userId: string, @Body() dto: SlotGameRequestDto): Promise<SlotGameResultDto> {
    return this.slotService.play(dto);
  }
}
