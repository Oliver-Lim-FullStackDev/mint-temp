import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PartnerAuthService } from '../services';

@Injectable()
export class PartnerAuthGuard implements CanActivate {
  constructor(private readonly authService: PartnerAuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const key = request.params.key;
    const authHeader = request.headers['authorization'];

    try {
      this.authService.validateToken(key, authHeader);
      return true;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}