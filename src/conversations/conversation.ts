import { CreateConversationParams, GetConversationMessagesParams, UpdateConversationParams } from "../utils/types";
import { Conversation, User } from '../utils/typeorm';

export interface IConversationService {
  createConversation(
    conversationParams: CreateConversationParams,
    user: User,
  ): Promise<Conversation>;

  isCreated(user1Id: number, user2id: number): Promise<boolean>;

  getConversations(id: number): Promise<Conversation[]>;

  findById(id: number): Promise<Conversation | undefined>;

  save(conversation: Conversation): Promise<Conversation>;

  getMessages(params: GetConversationMessagesParams): Promise<Conversation>;

  update(params: UpdateConversationParams);
}
