import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { AuthenticatedGuard } from '../auth/utils/guards';
import { IConversationService } from './conversation';
import { CreateConversationDto } from './dtos/craeteConversation.dto';
import { AuthUser } from '../utils/decorator';
import { User } from '../utils/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller(Routes.CONVERSATIONS)
@UseGuards(AuthenticatedGuard)
export class ConversationController {
  constructor(
    @Inject(Services.CONVERSATIONS)
    private readonly conversationService: IConversationService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createConversation(
    @AuthUser() user: User,
    @Body() createConversationPayload: CreateConversationDto,
  ) {
    const conversation = await this.conversationService.createConversation(
      createConversationPayload,
      user,
    );
    this.eventEmitter.emit('conversation.create', conversation);
    return conversation;
  }

  @Get()
  async getConversations(@AuthUser() { id }: User) {
    return this.conversationService.getConversations(id);
  }

  @Get(':id')
  async getConversationById(@Param('id') id: number) {
    return this.conversationService.findById(id);
  }
}
