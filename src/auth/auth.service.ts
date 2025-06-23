import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IAuthService } from './auth';
import { Services } from '../utils/constants';
import { ValidateUserDetails } from '../utils/types';
import { IUserService } from '../users/interfaces/user';
import { compareHash } from '../utils/helpers';

@Injectable()
export class AuthService implements IAuthService {
  constructor(@Inject(Services.USERS) private userService: IUserService) {}

  async validateUser(userDetails: ValidateUserDetails) {
    const user = await this.userService.findUser({ username: userDetails.username });
    if (!user)
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    const isPasswordValid = await compareHash(
      userDetails.password,
      user.password,
    );
    return isPasswordValid ? user : null;
  }
}
