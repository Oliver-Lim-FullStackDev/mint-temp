import { Controller, Get, Query } from '@nestjs/common';
import { CmsService } from '../services';

@Controller('cms')
export class BannersController {
  constructor(private readonly cmsService: CmsService) {}

  @Get('banners')
  async getAll() {
    return this.cmsService.getBanners();
  }
}
