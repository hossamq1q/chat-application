import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import * as session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import { Services } from '../../utils/constants';
import { ISessionService } from '../session';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(
    @Inject(Services.SESSIONS) private readonly sessionService: ISessionService,
  ) {}

  use(req: any, res: any, next: () => void) {
    const sessionRepository = this.sessionService.getSessionRepository();

    session({
      secret: process.env.COOKIE_SECRET || 'defaultSecret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 86400000,
      },
      store: new TypeormStore().connect(sessionRepository),
    })(req, res, next);
  }
}
