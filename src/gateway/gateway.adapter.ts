import { IoAdapter } from '@nestjs/platform-socket.io';
import { DataSource } from 'typeorm';
import { Sessions, User } from '../utils/typeorm';
import { AuthenticatedSocket } from '../utils/interfaces';
import { ServerOptions } from 'socket.io';
import * as cookieParser from 'cookie-parser';
import * as cookie from 'cookie';
import { plainToInstance } from 'class-transformer';
import { INestApplication } from "@nestjs/common";

export class WebsocketAdapter extends IoAdapter {
  private dataSource: DataSource;

  constructor(app: INestApplication,dataSource: DataSource) {
    super(app);
    this.dataSource = dataSource;
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const sessionRepository = this.dataSource.getRepository(Sessions);

    const server = super.createIOServer(port, options);

    server.use(async (socket: AuthenticatedSocket, next) => {
      const { cookie: clientCookie } = socket.handshake.headers;
      if (!clientCookie) {
        return next(new Error('not authenticated'));
      }

      const parsedCookie = cookie.parse(clientCookie);
      const sessionId = parsedCookie.CHAT_APP_SESSION_ID;

      if (!sessionId) {
        return next(new Error('not authenticated '));
      }
      const signedCookie = cookieParser.signedCookie(
        sessionId,
        process.env.COOKIE_SECRET,
      );

      if (!signedCookie) {
        return next(new Error('Error signing cookie'));
      }
      const sessionDB = await sessionRepository.findOne({
        where: { id: signedCookie },
      });
      if (!sessionDB) return next(new Error('No session found'));

      if (sessionDB.expiredAt < Date.now()) {
        return next(new Error('Session expired'));
      }

      const userFromJson = JSON.parse(sessionDB.json);
      if (!userFromJson.passport || !userFromJson.passport.user) {
        return next(new Error('Passport or User object does not exist.'));
      }

      const userDB = plainToInstance(
        User,
        userFromJson.passport.user,
      );

      socket.user = userDB;
      next();
    });
    return server;
  }
}
