import { Body, Controller, Get, Inject, Param, Patch, Post } from "@nestjs/common";
import { Routes, Services } from '../../utils/constants';
import { IGroupService } from '../interfaces/group';
import { AuthUser } from '../../utils/decorator';
import { User } from '../../utils/typeorm';
import { CreateGroupDto } from '../dtos/createGroup.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TransferOwnerDto } from "../dtos/transferOwner.dto";

@Controller(Routes.GROUPS)
export class GroupController {
  constructor(
    @Inject(Services.GROUPS) private readonly groupService: IGroupService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createGroup(@AuthUser() user: User, @Body() payload: CreateGroupDto) {
    const group = await this.groupService.createGroup({
      ...payload,
      creator: user,
    });
    this.eventEmitter.emit('group.create', group);
    return group;
  }

  @Get()
  getGroups(@AuthUser() user: User) {
    return this.groupService.getGroups({ userId: user.id });
  }

  @Get(':id')
  getGroup(@AuthUser() user: User, @Param('id') id: number) {
    return this.groupService.findGroupById(id);
  }

  @Patch(':id/owner')
  async updateGroupOwner(
    @AuthUser() { id: userId }: User,
    @Param('id') groupId: number,
    @Body() { newOwnerId }: TransferOwnerDto,
  ) {
    const params = { userId, groupId, newOwnerId };
    const group = await this.groupService.transferGroupOwner(params);
    this.eventEmitter.emit('group.owner.update', group);
    return group;
  }
}
