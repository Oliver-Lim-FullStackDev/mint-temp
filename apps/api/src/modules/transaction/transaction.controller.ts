import { Body, Controller, Post, Headers, UnauthorizedException } from '@nestjs/common';
import { CreateTonPurchaseDto, TonPurchaseResponseDto } from './ton-purchase.dto';
import { CreateStarsPurchaseDto, StarsPurchaseResponseDto } from './stars-purchase.dto';
import { TonPurchaseService } from './ton-purchase.service';
import { StarsPurchaseService } from './stars-purchase.service';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly tonPurchaseService: TonPurchaseService,
    private readonly starsPurchaseService: StarsPurchaseService,
  ) {}

  @Post('purchase/ton')
  async purchaseWithTon(@Body() dto: CreateTonPurchaseDto): Promise<TonPurchaseResponseDto> {
    const result = await this.tonPurchaseService.processPurchase(dto);
    return result;
  }

  @Post('purchase/stars')
  async purchaseWithStars(
    @Body() dto: CreateStarsPurchaseDto,
    @Headers('authorization') authHeader?: string
  ): Promise<StarsPurchaseResponseDto> {
    // Verify authentication token
    const expectedToken = process.env.HEROGAMING_MINT_API_TOKEN;
    if (!expectedToken) {
      throw new UnauthorizedException('MINT_API_AUTH_TOKEN not configured');
    }

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (token !== expectedToken) {
      throw new UnauthorizedException('Invalid authentication token');
    }

    const result = await this.starsPurchaseService.processPurchase(dto);
    return result;
  }
}
