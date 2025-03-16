import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { IMessageService } from './message';
import { CreateMessageDto } from './dtos/createMessage.dto';
import { AuthUser } from '../utils/decorator';
import { User } from '../utils/typeorm';
import { AuthenticatedGuard } from '../auth/utils/guards';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EditMessageDto } from './dtos/editMessage.dto';

@Controller(Routes.MESSAGES)
@UseGuards(AuthenticatedGuard)
export class MessageController {
  constructor(
    @Inject(Services.MESSAGES)
    private readonly messagesService: IMessageService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createMessage(
    @Body() messagePayload: CreateMessageDto,
    @AuthUser() user: User,
  ) {
    const message = await this.messagesService.createMessage({
      ...messagePayload,
      user,
    });
    this.eventEmitter.emit('message.create', message);
    return message;
  }

  @Get(':conversationId')
  async getConversationMessages(
    @Param('conversationId') conversationId: number,
  ) {
    return await this.messagesService.getConversationMessages(conversationId);
  }

  @Delete(':conversationId/:messageId')
  async deleteMessageFromConversation(
    @AuthUser() user: User,
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Param('messageId', ParseIntPipe) messageId: number,
  ) {
    const params = { userId: user.id, conversationId, messageId };
    await this.messagesService.deleteMessage(params);
    this.eventEmitter.emit('message.delete', params);
    return { messageId, conversationId };
  }

  @Patch(':conversationId/:messageId')
  async editMessage(
    @AuthUser() { id: userId }: User,
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Param('messageId', ParseIntPipe) messageId: number,
    @Body() { content }: EditMessageDto,
  ) {
    const message = await this.messagesService.editMessage({
      conversationId,
      messageId,
      userId,
      content,
    });
    this.eventEmitter.emit('message.update', message);
    return message;
  }
}
