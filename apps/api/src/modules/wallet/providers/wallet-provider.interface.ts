import {
  BalanceRequestDto,
  BalanceResponseDto,
} from '../dto/balance.dto';
import {
  DebitRequestDto,
  DebitResponseDto,
} from '../dto/debit.dto';
import {
  CreditRequestDto,
  CreditResponseDto,
} from '../dto/credit.dto';

export interface WalletProvider {
  balance(req: BalanceRequestDto): Promise<BalanceResponseDto>;
  debit(req: DebitRequestDto): Promise<DebitResponseDto>;
  credit(req: CreditRequestDto): Promise<CreditResponseDto>;
}
