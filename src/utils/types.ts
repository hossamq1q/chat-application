import { Group, GroupMessage, Message, User } from './typeorm';

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
  userId: number;
  conversationId: number;
  messageId: number;
};

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

export type UserProfileFiles = Partial<{
  banner: Express.Multer.File[];
  avatar: Express.Multer.File[];
}>;

export type UpdateUserProfileParams = Partial<{
  about: string;
  banner: Express.Multer.File;
  avatar: Express.Multer.File;
}>;

export type UpdateGroupDetailsParams = {
  id: number;
  title?: string;
  avatar?: Express.Multer.File;
  user: User;
};

export type AddGroupRecipientParams = {
  id: number;
  username: string;
  userId: number;
};

export type AddGroupUserResponse = {
  group: Group;
  user: User;
};

export type RemoveGroupRecipientParams = {
  id: number;
  removeUserId: number;
  issuerId: number;
};

export type RemoveGroupUserResponse = {
  group: Group;
  user: User;
};

export type LeaveGroupParams = {
  id: number;
  userId: number;
};

export type CheckUserGroupParams = {
  id: number;
  userId: number;
};

export type ResponseLeaveUserGroup = {
  group: Group;
  userId: number;
};

export type CreateGroupMessageParams = {
  groupId: number;
  author: User;
  content: string;
};

export type CreateGroupMessageResponse = {
  message: GroupMessage;
  group: Group;
};

export type DeleteGroupMessageParams = {
  userId: number;
  groupId: number;
  messageId: number;
};
export type DeleteGroupMessagePayload = {
  userId: number;
  messageId: number;
  groupId: number;
};

export type EditGroupMessageParams = {
  groupId: number;
  messageId: number;
  userId: number;
  content: string;
};

export type AccessParams = {
  id: number;
  userId: number;
};
