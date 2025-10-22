import type { GameInitResponse, GamePlayResponse, SlotGameConfig, SlotPlayResult } from '@mint/game-internal';

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentParamsDto } from './dto/payment-params.dto';
import { AcknowledgePaymentResponseDto } from './dto/acknowledge-payment-response.dto';
import { SlotGameService } from './slot-game.service';

interface PlayRequestBody {
  clientSeed?: string;
  wager?: number;
}

/**
 * Note: this is the general API controller all direct game providers
 * We started with Minty Spins but want to abstract it for access from the @mint/gamestudio-api
 */
@Controller()
export class SlotGameController {
  constructor(private readonly slotService: SlotGameService) {}

  @Get('games/:studioId/:gameId/init')
  init(
    @Param('studioId') studioId: string,
    @Param('gameId') gameId: string,
  ): Promise<GameInitResponse<SlotGameConfig>> {
    return this.slotService.init(studioId, gameId);
  }

  @Post('games/:studioId/:gameId/play')
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
