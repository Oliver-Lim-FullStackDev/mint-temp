import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { GameInitResponse, GamePlayResponse, SlotGameConfig, SlotPlayResult } from '@mint/game-internal';
import { SlotGameService } from './slot-game.service';
import { PaymentParamsDto } from './dto/payment-params.dto';
import { AcknowledgePaymentResponseDto } from './dto/acknowledge-payment-response.dto';

interface PlayRequestBody {
  clientSeed?: string;
  wager?: number;
}

@Controller()
export class GameStudioController {
  constructor(private readonly slotService: SlotGameService) {}

  @Get('internal/games/:studioId/:gameId/init')
  init(
    @Param('studioId') studioId: string,
    @Param('gameId') gameId: string,
  ): Promise<GameInitResponse<SlotGameConfig>> {
    return this.slotService.init(studioId, gameId);
  }

  @Post('internal/games/:studioId/:gameId/play')
  play(
    @Param('studioId') studioId: string,
    @Param('gameId') gameId: string,
    @Body() body: PlayRequestBody,
  ): Promise<GamePlayResponse<SlotPlayResult>> {
    return this.slotService.play(studioId, gameId, body);
  }

  @Get('games/:studioId/:gameId/config')
  getConfig(@Param('studioId') studioId: string, @Param('gameId') gameId: string): Promise<SlotGameConfig | undefined> {
    return this.slotService.getConfig(studioId, gameId);
  }

  @Post('games/:studioId/:gameId/payments/:action')
  acknowledgePayment(
    @Param() { studioId, gameId, action }: PaymentParamsDto,
    @Body() payload: Record<string, unknown>,
  ): AcknowledgePaymentResponseDto {
    return {
      studioId,
      gameId,
      action,
      received: true,
      payload,
    };
  }

  @Get('players/:playerId')
  getPlayer(@Param('playerId') playerId: string) {
    return this.slotService.getPlayer(playerId);
  }
}
