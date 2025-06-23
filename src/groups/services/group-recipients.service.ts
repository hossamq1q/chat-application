import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IGroupRecipientsService } from '../interfaces/group-recipients';
import {
  AddGroupRecipientParams,
  CheckUserGroupParams,
  LeaveGroupParams,
  RemoveGroupRecipientParams,
  RemoveGroupUserResponse,
} from '../../utils/types';
import { Services } from '../../utils/constants';
import { IUserService } from '../../users/interfaces/user';
import { IGroupService } from '../interfaces/group';
import { GroupNotFoundException } from '../exceptions/groupNotFound';
import { NotGroupOwnerException } from '../exceptions/notGroupOwner';
import { GroupParticipantNotFound } from '../exceptions/groupParticipantNotFound';

@Injectable()
export class GroupRecipientsService implements IGroupRecipientsService {
  constructor(
    @Inject(Services.USERS) private userService: IUserService,
    @Inject(Services.GROUPS) private groupService: IGroupService,
  ) {}

  async addGroupRecipient(params: AddGroupRecipientParams) {
    const group = await this.groupService.findGroupById(params.id);
    if (!group) throw new GroupNotFoundException();
    if (group.owner.id !== params.userId)
      throw new HttpException('Insufficient Permissions', HttpStatus.FORBIDDEN);
    const recipient = await this.userService.findUser({
      username: params.username,
    });
    if (!recipient)
      throw new HttpException('Cannot Add User', HttpStatus.BAD_REQUEST);
    const inGroup = group.users.find((user) => user.id === recipient.id);
    if (inGroup)
      throw new HttpException('User already in group', HttpStatus.BAD_REQUEST);
    group.users = [...group.users, recipient];
    const savedGroup = await this.groupService.saveGroup(group);
    return { group: savedGroup, user: recipient };
  }

  async removeGroupRecipient(params: RemoveGroupRecipientParams) {
    const { issuerId, removeUserId, id } = params;
    const userToBeRemoved = await this.userService.findUser({
      id: removeUserId,
    });
    if (!userToBeRemoved)
      throw new HttpException('User cannot be removed', HttpStatus.BAD_REQUEST);
    const group = await this.groupService.findGroupById(id);
    if (!group) throw new GroupNotFoundException();
    if (group.owner.id !== issuerId) throw new NotGroupOwnerException();
    if (group.owner.id === removeUserId)
      throw new HttpException(
        'Cannot remove yourself as owner',
        HttpStatus.BAD_REQUEST,
      );
    group.users = group.users.filter((u) => u.id !== removeUserId);
    const savedGroup = await this.groupService.saveGroup(group);
    return { group: savedGroup, user: userToBeRemoved };
  }

  private async isUserInGroup({ id, userId }: CheckUserGroupParams) {
    const group = await this.groupService.findGroupById(id);
    if (!group) throw new GroupNotFoundException();
    const user = group.users.find((user) => user.id === userId);
    if (!user) throw new GroupParticipantNotFound();
    return group;
  }

  async leaveGroup({ id, userId }: LeaveGroupParams) {
    const group = await this.isUserInGroup({ id, userId });
    if (group.owner.id === userId)
      throw new HttpException(
        'Cannot leave group as owner',
        HttpStatus.BAD_REQUEST,
      );
    group.users = group.users.filter((user) => user.id !== userId);
    return this.groupService.saveGroup(group);
  }
}
