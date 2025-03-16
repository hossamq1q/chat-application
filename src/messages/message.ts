import { Message } from '../utils/typeorm';
import {
  CreateMessageParams,
  DeleteMessageParams,
  EditMessageParams,
} from '../utils/types';

export interface IMessageService {
  createMessage(messagePayload: CreateMessageParams): Promise<Message>;

  getConversationMessages(conversationId: number): Promise<Message[]>;

  deleteMessage(params: DeleteMessageParams);

  editMessage(params: EditMessageParams): Promise<Message>;
}
