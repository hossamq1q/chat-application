import { Inject, Injectable } from '@nestjs/common';
import { IGroupService } from '../interfaces/group';
import { CreateGroupParams, FetchGroupsParams, TransferOwnerParams } from "src/utils/types";
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from '../../utils/typeorm';
import { Repository } from 'typeorm';
import { Services } from '../../utils/constants';
import { IUserService } from '../../users/user';
import { GroupNotFoundException } from "../exceptions/groupNotFound";
import { GroupOwnerTransferException } from "../exceptions/groupOwnerTransfer";
import { UserNotFoundException } from "../../users/exceptions/userNotFound";

@Injectable()
export class GroupService implements IGroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @Inject(Services.USERS) private readonly usersService: IUserService,
  ) {}

  async createGroup(params: CreateGroupParams) {
    const { creator, title } = params;
    const usersPromise = params.users.map((username) =>
      this.usersService.findUser({ username }),
    );
    const users = (await Promise.all(usersPromise)).filter((user) => user);
    users.push(creator);
    const groupParams = { owner: creator, users, creator, title };
    const group = this.groupRepository.create(groupParams);
    return this.groupRepository.save(group);
  }

  getGroups(params: FetchGroupsParams): Promise<Group[]> {
    return this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.users', 'user')
      .where('user.id IN (:users)', { users: [params.userId] })
      .leftJoinAndSelect('group.users', 'users')
      .leftJoinAndSelect('group.creator', 'creator')
      .leftJoinAndSelect('group.owner', 'owner')
      .leftJoinAndSelect('group.lastMessageSent', 'lastMessageSent')
      .orderBy('group.lastMessageSentAt', 'DESC')
      .getMany();
  }

  findGroupById(id: number): Promise<Group> {
    return this.groupRepository.findOne({
      where: { id },
      relations: ['creator', 'users', 'lastMessageSent', 'owner'],
    });
  }

  async transferGroupOwner({
    userId,
    groupId,
    newOwnerId,
  }: TransferOwnerParams): Promise<Group> {
    const group = await this.findGroupById(groupId);
    if (!group) throw new GroupNotFoundException();
    if (group.owner.id !== userId)
      throw new GroupOwnerTransferException('Insufficient Permissions');
    if (group.owner.id === newOwnerId)
      throw new GroupOwnerTransferException(
        'Cannot Transfer Owner to yourself',
      );
    const newOwner = await this.usersService.findUser({ id: newOwnerId });
    if (!newOwner) throw new UserNotFoundException();
    group.owner = newOwner;
    return this.groupRepository.save(group);
  }
}
