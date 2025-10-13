import { Controller, Get, Res } from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('')
  async getSession(@Res({ passthrough: true }) res: ExpressResponse) {
    const auth = this.sessionService.getSessionIdFromHeaders();
    if (auth) {
      const session = await this.sessionService.validateSession(auth);

      // if token changed we just refreshed an expired token, update our cookie
      if (session?.token && session.token !== auth) {
        this.sessionService.setSessionCookie(session.token, res);
      }
      return session;
    }
    return null;
  }
}
