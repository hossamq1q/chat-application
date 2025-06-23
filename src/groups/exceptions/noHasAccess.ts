import { HttpException, HttpStatus } from '@nestjs/common';

export class NoHasAccess extends HttpException {
  constructor() {
    super('you dont have access', HttpStatus.BAD_REQUEST);
  }
}
