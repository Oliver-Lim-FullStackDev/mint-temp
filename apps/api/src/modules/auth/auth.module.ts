import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { SessionModule } from '../session/session.module';
import { TransactionModule } from '../transaction/transaction.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [SessionModule, SharedModule, TransactionModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
