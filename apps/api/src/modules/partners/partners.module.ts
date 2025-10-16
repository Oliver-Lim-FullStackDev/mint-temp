import { Module } from '@nestjs/common';
import { PartnersController } from './controllers';
import { PartnersService, PartnerAuthService } from './services';
import { SharedModule } from 'src/shared/shared.module';

@Module({
    imports: [SharedModule],
    controllers: [PartnersController],
    providers: [PartnersService, PartnerAuthService],
    exports: [PartnersService, PartnerAuthService],
})
export class PartnersModule {}
