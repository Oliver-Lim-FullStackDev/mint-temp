import { Controller, Get } from '@nestjs/common';
import { STATIC_DROPS } from './drops.data';
import { DropData } from './drops.types';

@Controller('drops')
export class DropsController {
  @Get()
  findAll(): DropData {
    return STATIC_DROPS;
  }
}
