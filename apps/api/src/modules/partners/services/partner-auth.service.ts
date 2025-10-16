import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PARTNER_TOKENS } from '../constants';

@Injectable()
export class PartnerAuthService {
  validateToken(key: string, authHeader?: string): void {
    const partner = PARTNER_TOKENS.find((p) => p.key === key);
    if (!partner) throw new UnauthorizedException('Unknown partner');

    if (!authHeader) throw new UnauthorizedException('Missing Authorization header');

    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (token !== partner.token) {
      throw new UnauthorizedException('Invalid Authorization token');
    }
  }
}