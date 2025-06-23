import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { Services } from '../utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile, User } from '../utils/typeorm';
import { UserProfilesController } from './controllers/user-profile.controller';
import { UserProfileService } from './services/user-profile.service';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from '../utils/multerConfiguration';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    MulterModule.register(multerOptions),
  ],
  controllers: [UserController, UserProfilesController],
  providers: [
    { provide: Services.USERS, useClass: UserService },
    { provide: Services.USERS_PROFILES, useClass: UserProfileService },
  ],
  exports: [
    { provide: Services.USERS, useClass: UserService },
    {
      provide: Services.USERS_PROFILES,
      useClass: UserProfileService,
    },
  ],
})
export class UsersModule {}
