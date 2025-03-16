import { Controller, Inject } from "@nestjs/common";
import { Routes, Services } from "../utils/constants";
import { IUserService } from "./user";

@Controller(Routes.USERS)
export class UserController {
  constructor (@Inject(Services.USERS) private usersService: IUserService) {}
}
