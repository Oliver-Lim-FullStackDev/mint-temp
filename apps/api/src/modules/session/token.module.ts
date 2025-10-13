import { Global, Module } from '@nestjs/common';
import { TokenService } from './token.service';

/**
 * Global module for TokenService
 * This makes TokenService available to all modules without explicit imports
 */
@Global()
@Module({
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
