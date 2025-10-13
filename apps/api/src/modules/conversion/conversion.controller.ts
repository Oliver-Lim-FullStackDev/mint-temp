import { Controller, Get, Query } from '@nestjs/common';
import { TonConversionService } from './ton-conversion.service';
import { StarsConversionService } from './stars-conversion.service';
import { Currency, CurrencyConversion } from '@mint/types';

@Controller('convert')
export class ConversionController {
  constructor(
    private readonly tonConversionService: TonConversionService,
    private readonly starsConversionService: StarsConversionService,
  ) {}

  @Get('stars')
  async convertToStars(
    @Query('amount') amount: string,
    @Query('from') from: string = Currency.USD,
  ): Promise<CurrencyConversion> {
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount < 0) {
      throw new Error('Invalid amount provided');
    }

    if (from.toUpperCase() !== Currency.USD) {
      throw new Error('Only USD to Stars conversion is currently supported');
    }

    const starsAmount = await this.starsConversionService.convertUsdToStars(numericAmount);
    const starsRate = await this.starsConversionService.getStarsRate();

    return {
      from: { currency: Currency.USD, amount: numericAmount },
      to: { currency: Currency.STARS, amount: starsAmount },
      rate: { usdPerStar: starsRate },
    };
  }

  @Get('ton')
  async convertToTon(
    @Query('amount') amount: string,
    @Query('from') from: string = Currency.USD,
  ): Promise<CurrencyConversion> {
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount < 0) {
      throw new Error('Invalid amount provided');
    }

    if (from.toUpperCase() !== Currency.USD) {
      throw new Error('Only USD to TON conversion is currently supported');
    }

    const tonAmount = await this.tonConversionService.convertUsdToTon(numericAmount);
    const tonPrice = await this.tonConversionService.getTonPrice();

    return {
      from: { currency: Currency.USD, amount: numericAmount },
      to: { currency: Currency.TON, amount: tonAmount },
      rate: { usdPerTon: tonPrice },
    };
  }
}
