import { CreateUserDetails, FindUserParams } from "../utils/types";
import { User } from "../utils/typeorm";

export interface IUserService {
  createUser(userDetails: CreateUserDetails);
  findUser(findUserParams:FindUserParams):Promise<User>;
}
