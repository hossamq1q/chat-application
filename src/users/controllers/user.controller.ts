import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Query, UseGuards
} from "@nestjs/common";
import { Routes, Services } from '../../utils/constants';
import { IUserService } from '../interfaces/user';
import { UserAlreadyExists } from "../exceptions/userAlreadyExists";
import { AuthenticatedGuard } from "../../auth/utils/guards";

@Controller(Routes.USERS)
@UseGuards(AuthenticatedGuard)
export class UserController {
  constructor(@Inject(Services.USERS) private usersService: IUserService) {}

  @Get('search')
  searchUsers(@Query('query') query: string) {
    if (!query)
      throw new HttpException('provide query', HttpStatus.BAD_REQUEST);
    return this.usersService.searchUsers(query);
  }

  @Get('check')
  async checkUsername(@Query('username') username: string) {
    if (!username)
      throw new HttpException('Invalid Query', HttpStatus.BAD_REQUEST);
    const user = await this.usersService.findUser({ username });
    if (user) throw new UserAlreadyExists();
    return HttpStatus.OK;
  }
}
