import type { StoreItem } from '@mint/types/store';
import { Controller, Get, Param } from '@nestjs/common';
import { StarsConversionService } from '../conversion/stars-conversion.service';
import { TonConversionService } from '../conversion/ton-conversion.service';
import { StoreService } from './store.service';

@Controller('store/items')
export class StoreController {
  constructor(
    private readonly service: StoreService,
    private readonly tonConversionService: TonConversionService,
    private readonly starsConversionService: StarsConversionService,
  ) {}

  @Get()
  findAll(): Promise<StoreItem[]> {
    return this.service.findAll();
  }

  @Get('prices')
  async findAllWithPrices(): Promise<StoreItem[]> {
    const items = await this.service.findAll();

    // Convert each item to include current pricing
    const itemsWithPrices = await Promise.all(
      items.map(async (item) => {
        const itemWithPrices = { ...item };

        // Calculate current prices based on USD price
        if (item.price.usd > 0) {
          const starsPrice = await this.starsConversionService.convertUsdToStars(item.price.usd);
          const tonPrice = await this.tonConversionService.convertUsdToTon(item.price.usd);

          itemWithPrices.price = {
            ...item.price,
            stars: starsPrice,
            ton: tonPrice,
          };
        }

        return itemWithPrices;
      }),
    );

    return itemsWithPrices;
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<StoreItem | null> {
    return this.service.findOne(id);
  }

  @Get(':id/prices')
  async findOneWithPrices(@Param('id') id: string): Promise<StoreItem | null> {
    const item = await this.service.findOne(id);
    if (!item) {
      return null;
    }

    const itemWithPrices = { ...item };

    // Calculate current prices based on USD price
    if (item.price.usd > 0) {
      const starsPrice = await this.starsConversionService.convertUsdToStars(item.price.usd);
      const tonPrice = await this.tonConversionService.convertUsdToTon(item.price.usd);

      itemWithPrices.price = {
        ...item.price,
        stars: starsPrice,
        ton: tonPrice,
      };
    }

    return itemWithPrices;
  }
}
