import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { Services } from '../utils/constants';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Conversation, Message } from "../utils/typeorm";
import { ConversationsModule } from "../conversations/conversations.module";


@Module({
  imports:[ConversationsModule,TypeOrmModule.forFeature([Message , Conversation])],
  controllers: [MessageController],
  providers: [{ provide: Services.MESSAGES, useClass: MessageService }],
})
export class MessagesModule {}
