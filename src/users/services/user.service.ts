import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUserService } from '../interfaces/user';
import { CreateUserDetails, FindUserParams } from '../../utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../utils/typeorm';
import { hashPassword } from '../../utils/helpers';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  searchUsers(query: string) {
    const statement = '(user.username LIKE :query)';
    return this.userRepository
      .createQueryBuilder('user')
      .where(statement, { query: `%${query}%` })
      .limit(10)
      .select(['user.username', 'user.firstName', 'user.lastName', 'user.id'])
      .getMany();
  }

  findUser(findUserParams: FindUserParams): Promise<User> {
    return this.userRepository.findOne({
      where: findUserParams,
      relations: ['profile'],
    });
  }

  async createUser(userDetails: CreateUserDetails) {
    const existingUser = await this.userRepository.findOne({
      where: { username: userDetails.username },
    });
    if (existingUser)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    const hashedPassword = await hashPassword(userDetails.password);
    const newUser = this.userRepository.create({
      ...userDetails,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }
}
