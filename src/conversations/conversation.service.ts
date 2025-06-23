import { Inject, Injectable } from '@nestjs/common';
import { IConversationService } from './conversation';
import {
  CreateConversationParams,
  GetConversationMessagesParams,
  UpdateConversationParams,
} from '../utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation, Message, User } from "../utils/typeorm";
import { Repository } from 'typeorm';
import { IUserService } from '../users/interfaces/user';
import { Services } from '../utils/constants';
import { ConversationNotFoundException } from './exceptions/conversationNotFound';
import { CreateConversationException } from './exceptions/createConversation';
import { ConversationExistsException } from './exceptions/conversationExist';

@Injectable()
export class ConversationService implements IConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @Inject(Services.USERS) private readonly userService: IUserService,
  ) {}

  async findById(id: number): Promise<Conversation | undefined> {
    return this.conversationRepository.findOne({
      where: { id },
      relations: ['user1', 'user2', 'lastMessageSent'],
    });
  }

  async getConversations(id: number): Promise<Conversation[]> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
      .leftJoinAndSelect('conversation.user1', 'user1')
      .leftJoinAndSelect('conversation.user2', 'user2')
      .where('user1.id = :id', { id })
      .orWhere('user2.id = :id', { id })
      .orderBy('conversation.lastMessageSentAt', 'DESC')
      .getMany();
  }

  getMessages({
    id,
    limit,
  }: GetConversationMessagesParams): Promise<Conversation> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .where('conversation.id = :id', { id })
      .leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
      .leftJoinAndSelect('conversation.messages', 'message')
      .orderBy('message.createdAt', 'DESC')
      .limit(limit)
      .getOne();
  }

  async isCreated(user1Id: number, user2Id: number) {
    const exist = await this.conversationRepository.findOne({
      where: [
        {
          user1: { id: user1Id },
          user2: { id: user2Id },
        },
        {
          user1: { id: user2Id },
          user2: { id: user1Id },
        },
      ],
    });
    return !!exist;
  }

  async createConversation(
    params: CreateConversationParams,
    user1: User,
  ): Promise<Conversation> {
    const { username, message: content } = params;
    const user2 = await this.userService.findUser({ username });
    if (!user2) throw new ConversationNotFoundException();
    if (user1.id === user2.id)
      throw new CreateConversationException(
        'Cannot create Conversation with yourself',
      );
    const exists = await this.isCreated(user1.id, user2.id);
    if (exists) throw new ConversationExistsException();
    const newConversation = this.conversationRepository.create({
      user1,
      user2,
    });
    const conversation = await this.conversationRepository.save(newConversation);
    const newMessage = this.messageRepository.create({
      content,
      conversation,
      author: user1,
    });
    await this.messageRepository.save(newMessage);
    return conversation;
  }

  save(conversation: Conversation): Promise<Conversation> {
    return this.conversationRepository.save(conversation);
  }

  update({ id, lastMessageSent }: UpdateConversationParams) {
    return this.conversationRepository.update(id, { lastMessageSent });
  }
}
