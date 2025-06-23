import { Body, Controller, Delete, Inject, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { Routes, Services } from '../../utils/constants';
import { GroupRecipientsService } from '../services/group-recipients.service';
import { IGroupRecipientsService } from '../interfaces/group-recipients';
import { AuthUser } from '../../utils/decorator';
import { User } from '../../utils/typeorm';
import { AddGroupRecipientDto } from '../dtos/addGroupRecipient.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthenticatedGuard } from "../../auth/utils/guards";

@Controller(Routes.GROUP_RECIPIENTS)
@UseGuards(AuthenticatedGuard)
export class GroupRecipientsController {
  constructor(
    @Inject(Services.GROUP_RECIPIENTS)
    private readonly groupRecipientService: IGroupRecipientsService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async addGroupRecipient(
    @AuthUser() { id: userId }: User,
    @Param('id',ParseIntPipe) id: number,
    @Body() { username }: AddGroupRecipientDto,
  ) {
    const params = { id, userId, username };
    const response = await this.groupRecipientService.addGroupRecipient(params);
    this.eventEmitter.emit('group.user.add', response);
    return response;
  }

  @Delete(':userId')
  async removeGroupRecipient(
    @AuthUser() { id: issuerId }: User,
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) removeUserId: number,
  ) {
    const params = { issuerId, id, removeUserId };
    const response = await this.groupRecipientService.removeGroupRecipient(
      params,
    );
    this.eventEmitter.emit('group.user.remove', response);
    return response.group;
  }

  @Delete('leave')
  async leaveGroup(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) groupId: number,
  ) {
    const group = await this.groupRecipientService.leaveGroup({
      id: groupId,
      userId: user.id,
    });
    this.eventEmitter.emit('group.user.leave', { group, userId: user.id });
    return group;
  }
}
