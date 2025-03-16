import { Message, User } from "./typeorm";

export type CreateUserDetails = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type ValidateUserDetails = {
  username: string;
  password: string;
};

export type FindUserParams = Partial<{
  id: number;
  username: string;
}>;

export type CreateConversationParams = {
  username: string;
  message: string;
};

export type CreateMessageParams = {
  content: string;
  conversationId: number;
  user: User;
};

export type DeleteMessageParams = {
  userId:number;
  conversationId:number;
  messageId:number;
}

export type GetConversationMessagesParams = {
  id: number;
  limit: number;
};

export type FindMessageParams = {
  userId: number;
  conversationId: number;
  messageId: number;
};

export type UpdateConversationParams = Partial<{
  id: number;
  lastMessageSent: Message;
}>;

export type EditMessageParams = {
  conversationId: number;
  messageId: number;
  userId: number;
  content: string;
};

export type CreateGroupParams = {
  creator: User;
  title?: string;
  users: string[];
};

export type FetchGroupsParams = {
  userId: number;
};

export type TransferOwnerParams = {
  userId: number;
  groupId: number;
  newOwnerId: number;
};


