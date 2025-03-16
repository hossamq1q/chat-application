import { HttpException, HttpStatus } from '@nestjs/common';

export class CannotEditMessage extends HttpException {
  constructor() {
    super('Cannot Edit Message', HttpStatus.BAD_REQUEST);
  }
}
