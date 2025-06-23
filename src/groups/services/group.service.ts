import { Inject, Injectable } from "@nestjs/common";
import { IGroupService } from "../interfaces/group";
import {
  AccessParams,
  CreateGroupParams,
  FetchGroupsParams,
  TransferOwnerParams,
  UpdateGroupDetailsParams
} from "src/utils/types";
import { InjectRepository } from "@nestjs/typeorm";
import { Group, User } from "../../utils/typeorm";
import { Repository } from "typeorm";
import { Services } from "../../utils/constants";
import { IUserService } from "../../users/interfaces/user";
import { GroupNotFoundException } from "../exceptions/groupNotFound";
import { GroupOwnerTransferException } from "../exceptions/groupOwnerTransfer";
import { UserNotFoundException } from "../../users/exceptions/userNotFound";
import { userIsNotInGroup } from "../exceptions/userIsNotInGroup";
import { deleteFile, processImage } from "../../utils/helpers";
import { NoHasAccess } from "../exceptions/noHasAccess";

@Injectable()
export class GroupService implements IGroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @Inject(Services.USERS) private readonly usersService: IUserService,
  ) {}

  saveGroup(group: Group): Promise<Group> {
    return this.groupRepository.save(group);
  }

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

  private isUserInGroup(userId: number, groupUsers: User[]): boolean {
    return groupUsers.some((user: User) => user.id === userId);
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
    if (!this.isUserInGroup(newOwnerId, group.users))
      throw new userIsNotInGroup();
    if (group.owner.id === newOwnerId)
      throw new GroupOwnerTransferException(
        'Cannot Transfer Owner to yourself',
      );
    const newOwner = await this.usersService.findUser({ id: newOwnerId });
    if (!newOwner) throw new UserNotFoundException();
    group.owner = newOwner;
    return this.groupRepository.save(group);
  }

  async updateDetails(params: UpdateGroupDetailsParams): Promise<Group> {
    const group = await this.findGroupById(params.id);
    if (!group) throw new GroupNotFoundException();
    if (group.owner.id !== params.user.id) throw new NoHasAccess();
    if (params.avatar) {
      if (group.avatar) {
        deleteFile(group.avatar, 'groups/avatars');
      }
      group.avatar = await processImage(params.avatar.buffer, 'groups/avatars');
    }
    group.title = params.title ?? group.title;
    return this.groupRepository.save(group);
  }

  async hasAccess({ id, userId }: AccessParams): Promise<User | undefined> {
    const group = await this.findGroupById(id);
    if (!group) throw new GroupNotFoundException();
    return group.users.find((user) => user.id === userId);
  }
}
