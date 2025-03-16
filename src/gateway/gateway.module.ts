import { Module } from '@nestjs/common';
import { MessagingGateway } from './websocket.gateway';
import { SessionModule } from '../sessions/session.module';
import { GatewaySessionManager } from './gateway.session';
import { Services } from '../utils/constants';
import { ConversationsModule } from "../conversations/conversations.module";

@Module({
  imports:[ConversationsModule],
  providers: [
    MessagingGateway,
    {
      provide: Services.GATEWAY_SESSION_MANAGER,
      useClass: GatewaySessionManager,
    },
  ],
})
export class GatewayModule {}
