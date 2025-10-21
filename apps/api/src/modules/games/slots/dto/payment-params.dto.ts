import { IsString } from 'class-validator';

export class PaymentParamsDto {
  @IsString()
  studioId!: string;

  @IsString()
  gameId!: string;

  @IsString()
  action!: string;
}
