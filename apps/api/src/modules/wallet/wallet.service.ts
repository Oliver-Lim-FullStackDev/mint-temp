import { Injectable, Inject } from '@nestjs/common';
import {
  BalanceRequestDto,
  BalanceResponseDto,
} from './dto/balance.dto';
import { DebitRequestDto, DebitResponseDto } from './dto/debit.dto';
import { CreditRequestDto, CreditResponseDto } from './dto/credit.dto';
import { HeroGamingWalletProvider } from './providers/hero-gaming-wallet.provider';

@Injectable()
export class WalletService {
  constructor(
    private readonly provider: HeroGamingWalletProvider,
  ) {}

  balance(req: BalanceRequestDto) {
    return this.provider.balance(req);
  }

  debit(req: DebitRequestDto) {
    return this.provider.debit(req);
  }

  credit(req: CreditRequestDto) {
    return this.provider.credit(req);
  }
}
