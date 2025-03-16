import { HttpException, HttpStatus } from '@nestjs/common';

export class CreateConversationException extends HttpException {
  constructor(msg?: string) {
    const defaultMessage = 'create Conversation Exception';
    super(
      msg ? defaultMessage.concat(`:${msg}`) : defaultMessage,
      HttpStatus.BAD_REQUEST,
    );
  }
}
