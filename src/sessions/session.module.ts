import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sessions } from '../utils/typeorm';
import { SessionService } from './session.service';
import { Services } from '../utils/constants';
import { SessionMiddleware } from './middlewares/sessionMiddleware';

@Module({
  imports: [TypeOrmModule.forFeature([Sessions])],
  providers: [
    SessionMiddleware,
    { provide: Services.SESSIONS, useClass: SessionService },
  ],
  exports: [{ provide: Services.SESSIONS, useClass: SessionService }],
})
export class SessionModule {}
