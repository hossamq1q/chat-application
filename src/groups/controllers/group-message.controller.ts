import {
  Body,
  Controller, Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe, Patch,
  Post, UseGuards
} from "@nestjs/common";
import { Routes, Services } from '../../utils/constants';
import { AuthUser } from '../../utils/decorator';
import { User } from '../../utils/typeorm';
import { CreateGroupMessageDto } from '../dtos/createGroupMessage.dto';
import { IGroupMessageService } from '../interfaces/group-message';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EditGroupMessageDto } from "../dtos/editGroupMessage.dto";
import { AuthenticatedGuard } from "../../auth/utils/guards";

@Controller(Routes.GROUP_MESSAGES)
@UseGuards(AuthenticatedGuard)
export class GroupMessageController {
  constructor(
    @Inject(Services.GROUP_MESSAGES)
    private readonly groupMessageService: IGroupMessageService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createGroupMessage(
    @AuthUser() user: User,
    @Body() { content, groupId }: CreateGroupMessageDto,
  ) {
    const params = { groupId, author: user, content };
    const response = await this.groupMessageService.createGroupMessage(params);
    this.eventEmitter.emit('group.message.create', response);
    return;
  }

  @Get(':id')
  async getGroupMessages(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const messages = await this.groupMessageService.getGroupMessages(id);
    return { id, messages };
  }

  @Delete(':messageId/:groupId')
  async deleteGroupMessage(
    @AuthUser() user: User,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('messageId', ParseIntPipe) messageId: number,
  ) {
    await this.groupMessageService.deleteGroupMessage({
      userId: user.id,
      groupId,
      messageId,
    });
    this.eventEmitter.emit('group.message.delete', {
      userId: user.id,
      messageId,
      groupId,
    });
    return { groupId, messageId };
  }

  @Patch(':messageId/:groupId')
  async editGroupMessage(
    @AuthUser() { id: userId }: User,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('messageId', ParseIntPipe) messageId: number,
    @Body() { content }: EditGroupMessageDto,
  ) {
    const params = { userId, content, groupId, messageId };
    const message = await this.groupMessageService.editGroupMessage(params);
    this.eventEmitter.emit('group.message.update', message);
    return message;
  }
}
