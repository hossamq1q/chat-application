import { HttpException, HttpStatus } from '@nestjs/common';

export class userIsNotInGroup extends HttpException {
  constructor() {
    super('user is not in the group', HttpStatus.BAD_REQUEST);
  }
}