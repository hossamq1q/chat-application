import { MulterField } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

export enum Routes {
  AUTH = 'auth',
  USERS = 'users',
  CONVERSATIONS = 'conversations',
  MESSAGES = 'messages',
  GROUPS = 'groups',
  GROUP_MESSAGES = 'groups/:id/messages',
  GROUP_RECIPIENTS = 'groups/:id/recipients',
  USERS_PROFILES = 'users/profiles',
}

export enum Services {
  AUTH = 'AUTH_SERVICE',
  USERS = 'USER_SERVICE',
  CONVERSATIONS = 'CONVERSATION_SERVICE',
  MESSAGES = 'MESSAGES_SERVICE',
  SESSIONS = 'SESSIONS_SERVICE',
  GATEWAY_SESSION_MANAGER = 'GATEWAY_SESSION_MANAGER',
  GROUPS = 'GROUPS_SERVICE',
  GROUP_MESSAGES = 'GROUP_MESSAGES_SERVICE',
  GROUP_RECIPIENTS = 'GROUP_RECIPIENTS_SERVICE',
  USERS_PROFILES = 'USERS_PROFILES_SERVICE',
}

export const UserProfileFileFields: MulterField[] = [
  {
    name: 'banner',
    maxCount: 1,
  },
  {
    name: 'avatar',
    maxCount: 1,
  },
];
