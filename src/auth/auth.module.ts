import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Services } from '../utils/constants';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './utils/localStrategy';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './utils/serializer';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    SessionSerializer,
    { provide: Services.AUTH, useClass: AuthService },
  ],
})
export class AuthModule {}
