import { Injectable } from '@nestjs/common';
import { ProvablyFairService as CoreProvablyFairService } from '@mint/game-internal';

@Injectable()
export class ProvablyFairService extends CoreProvablyFairService {}
