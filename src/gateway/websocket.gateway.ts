import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { AuthenticatedSocket } from '../utils/interfaces';
import { Inject } from '@nestjs/common';
import { Services } from '../utils/constants';
import { IGatewaySessionManager } from './gateway.session';
import { Conversation, Group, Message } from "../utils/typeorm";
import { IConversationService } from '../conversations/conversation';
import { DeleteMessageParams } from '../utils/types';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class MessagingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(Services.GATEWAY_SESSION_MANAGER)
    private readonly sessions: IGatewaySessionManager,
    @Inject(Services.CONVERSATIONS)
    private readonly conversationService: IConversationService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    console.log(`user ${socket.user.username} is connected`);
    this.sessions.setUserSocket(socket.user.id, socket);
    socket.emit('connected', { status: 'success connection' });
  }

  handleDisconnect(socket: AuthenticatedSocket, ...args: any[]) {
    console.log(`user ${socket.user.username} is disconnected`);
    this.sessions.removeUserSocket(socket.user.id);
  }

  @SubscribeMessage('createMessage')
  handleCreateMessage(@MessageBody() message: any) {
    console.log(message);
  }

  @SubscribeMessage('onUserTyping')
  async handleUserTyping(@MessageBody() data: any) {
    const id = parseInt(data.conversationId);
    const conversation = this.conversationService.findById(id);
    console.log(conversation);
  }

  @OnEvent('message.create')
  handleMessageCreateEvent(payload: Message) {
    const {
      author,
      conversation: { user1, user2 },
    } = payload;
    const recipientSocket =
      user1.id == author.id
        ? this.sessions.getUserSocket(user2.id)
        : this.sessions.getUserSocket(user1.id);
    if (recipientSocket) {
      recipientSocket.emit('onMessage', payload);
    } else {
      console.warn(`the recipient is offline`);
    }
  }

  @OnEvent('message.delete')
  async handleMessageDeleteEvent(payload: DeleteMessageParams) {
    const conversation = await this.conversationService.findById(
      payload.conversationId,
    );
    if (!conversation) return;
    const { user1, user2 } = conversation;
    const recipientSocket =
      payload.userId === user1.id
        ? this.sessions.getUserSocket(user2.id)
        : this.sessions.getUserSocket(user1.id);
    if (recipientSocket) {
      recipientSocket.emit('onMessageDelete', payload);
    } else {
      console.warn(`the recipient is offline`);
    }
  }

  @OnEvent('message.update')
  async handleMessageUpdate(message: Message) {
    const {
      author,
      conversation: { user1, user2 },
    } = message;
    console.log(message);
    const recipientSocket =
      author.id === user1.id
        ? this.sessions.getUserSocket(user2.id)
        : this.sessions.getUserSocket(user1.id);
    if (recipientSocket) recipientSocket.emit('onMessageUpdate', message);
  }

  @OnEvent('conversation.create')
  handleConversationCreateEvent(payload: Conversation) {
    const recipientSocket = this.sessions.getUserSocket(payload.user2.id);
    if (recipientSocket) recipientSocket.emit('onConversation', payload);
  }

  @OnEvent('group.create')
  handleGroupCreate(payload: Group) {
    payload.users.forEach((user) => {
      const socket = this.sessions.getUserSocket(user.id);
      socket && socket.emit('onGroupCreate', payload);
    });
  }

  @SubscribeMessage('onGroupJoin')
  onGroupJoin(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    console.log('onGroupJoin');
    client.join(`group-${data.groupId}`);
    console.log(client.rooms);
    client.to(`group-${data.groupId}`).emit('userGroupJoin');
  }

  @SubscribeMessage('onGroupLeave')
  onGroupLeave(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    console.log('onGroupLeave');
    client.leave(`group-${data.groupId}`);
    console.log(client.rooms);
    client.to(`group-${data.groupId}`).emit('userGroupLeave');
  }


  @OnEvent('group.owner.update')
  handleGroupOwnerUpdate(payload: Group) {
    const ROOM_NAME = `group-${payload.id}`;
    const newOwnerSocket = this.sessions.getUserSocket(payload.owner.id);
    const { rooms } = this.server.sockets.adapter;
    const socketsInRoom = rooms.get(ROOM_NAME);
    this.server.to(ROOM_NAME).emit('onGroupOwnerUpdate', payload);
    if (newOwnerSocket && !socketsInRoom.has(newOwnerSocket.id)) {
      newOwnerSocket.emit('onGroupOwnerUpdate', payload);
    }
  }
}
