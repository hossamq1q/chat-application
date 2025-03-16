import { FindMessageParams } from './types';

export const buildFindMessageParams = (params: FindMessageParams) => ({
  where: {
    id: params.messageId,
    author: { id: params.userId },
    conversation: { id: params.conversationId },
  },
});
