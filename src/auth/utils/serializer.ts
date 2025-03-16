import { PassportSerializer } from '@nestjs/passport';
import { Services } from '../../utils/constants';
import { Inject, Injectable } from '@nestjs/common';
import { IAuthService } from '../auth';
import { User } from '../../utils/typeorm';
import { IUserService } from '../../users/user';
import { instanceToPlain } from "class-transformer";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject(Services.USERS) private readonly userService: IUserService,
  ) {
    super();
  }

  serializeUser(user: User, done: Function) {
    done(null, user);
  }

  async deserializeUser(user: User, done: Function) {
    const userDb = await this.userService.findUser({ id: user.id });
    return userDb ? done(null, instanceToPlain(userDb)) : done(null, null);
  }
}
