import { CreateUserDetails, FindUserParams } from '../../utils/types';
import { User } from '../../utils/typeorm';

export interface IUserService {
  createUser(userDetails: CreateUserDetails): Promise<User>;

  findUser(findUserParams: FindUserParams): Promise<User>;

  searchUsers(query: string): Promise<User[]>;
}
