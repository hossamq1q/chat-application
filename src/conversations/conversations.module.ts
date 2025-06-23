import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { Services } from '../utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation, Message, User } from "../utils/typeorm";
import { UserService } from '../users/services/user.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation , Message]), UsersModule],
  controllers: [ConversationController],
  providers: [
    { provide: Services.CONVERSATIONS, useClass: ConversationService },
  ],
  exports: [{ provide: Services.CONVERSATIONS, useClass: ConversationService }],
})
export class ConversationsModule {}
