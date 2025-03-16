import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IMessageService } from './message';
import { Message } from 'src/utils/typeorm/entities/Message';
import {
  CreateMessageParams,
  DeleteMessageParams,
  EditMessageParams,
} from '../utils/types';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation, User } from '../utils/typeorm';
import { IConversationService } from '../conversations/conversation';
import { Services } from '../utils/constants';
import { ConversationNotFoundException } from '../conversations/exceptions/conversationNotFound';
import { instanceToPlain } from 'class-transformer';
import { buildFindMessageParams } from '../utils/builders';
import { CannotDeleteMessage } from './exceptions/cannotDeleteMessage';
import { CannotEditMessage } from './exceptions/cannotEditMessage';

@Injectable()
export class MessageService implements IMessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Message)
    private readonly conversationRepository: Repository<Conversation>,
    @Inject(Services.CONVERSATIONS)
    private readonly conversationService: IConversationService,
  ) {}

  async editMessage(params: EditMessageParams): Promise<Message> {
    const messageDb = await this.messageRepository.findOne({
      where: { id: params.messageId, author: { id: params.userId } },
      relations: [
        'conversation',
        'conversation.user1',
        'conversation.user2',
        'author',
      ],
    });
    if (!messageDb) throw new CannotEditMessage();
    messageDb.content = params.content;
    return this.messageRepository.save(messageDb);
  }

  async deleteMessage(params: DeleteMessageParams) {
    const { conversationId } = params;
    const msgParams = { id: conversationId, limit: 5 };
    const conversation = await this.conversationService.getMessages(msgParams);
    if (!conversation) throw new ConversationNotFoundException();
    const findMessageParams = buildFindMessageParams(params);
    const message = await this.messageRepository.findOne(findMessageParams);
    if (!message) throw new CannotDeleteMessage();
    if (conversation.lastMessageSent.id !== message.id)
      return this.messageRepository.delete({ id: message.id });
    return this.deleteLastMessage(conversation, message);
  }

  private async deleteLastMessage(
    conversation: Conversation,
    message: Message,
  ) {
    const size = conversation.messages.length;
    const SECOND_MESSAGE_INDEX = 1;
    if (size <= 1) {
      await this.conversationService.update({
        id: conversation.id,
        lastMessageSent: null,
      });
      return this.messageRepository.delete({ id: message.id });
    } else {
      const newLastMessage = conversation.messages[SECOND_MESSAGE_INDEX];
      await this.conversationService.update({
        id: conversation.id,
        lastMessageSent: newLastMessage,
      });
      return this.messageRepository.delete({ id: message.id });
    }
  }

  async getConversationMessages(conversationId: number): Promise<Message[]> {
    return this.messageRepository.find({
      relations: ['author'],
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'ASC' },
      loadRelationIds: true,
    });
  }

  async createMessage({
    user,
    content,
    conversationId,
  }: CreateMessageParams): Promise<Message> {
    const conversation =
      await this.conversationService.findById(conversationId);
    if (!conversation) throw new ConversationNotFoundException();
    const { user1, user2 } = conversation;
    if (user1.id !== user.id && user2.id !== user.id)
      throw new HttpException('Cannot create message', HttpStatus.CONFLICT);
    const newMessage = this.messageRepository.create({
      content,
      conversation,
      author: user,
      createdAt: new Date(),
    });
    const savedMessage = await this.messageRepository.save(newMessage);
    conversation.lastMessageSent = savedMessage;
    const updated = await this.conversationService.save(conversation);

    return savedMessage;
  }
}
