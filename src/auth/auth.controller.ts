import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { AuthService } from './auth.service';
import { IAuthService } from './auth';
import { CreateUserDto } from './dtos/createUser.dto';
import { IUserService } from '../users/user';
import { AuthenticatedGuard, LocalAuthGuard } from './utils/guards';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private authService: IAuthService,
    @Inject(Services.USERS) private userService: IUserService,
  ) {}

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Res() res: Response) {
    res.sendStatus(200)
  }

  @Get('status')
  @UseGuards(AuthenticatedGuard)
  status(@Req() req: Request, @Res() res: Response) {
    res.send(req.user);
  }

  @Post('logout')
  logout() {}
}
