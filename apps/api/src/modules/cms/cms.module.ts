import { Module } from '@nestjs/common';
import { CmsService } from './services';
import { BannersController } from './controllers';
import { PayloadClient } from './clients/payload.client';

@Module({
  providers: [CmsService, PayloadClient],
  controllers: [BannersController],
  exports: [CmsService],
})
export class CmsModule {}
