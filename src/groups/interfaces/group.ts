import {
  AccessParams,
  CreateGroupParams,
  FetchGroupsParams,
  TransferOwnerParams,
  UpdateGroupDetailsParams
} from "../../utils/types";
import { Group, User } from "../../utils/typeorm";

export interface IGroupService {
  createGroup(params: CreateGroupParams): Promise<Group>;
  getGroups(params: FetchGroupsParams): Promise<Group[]>;
  findGroupById(id: number): Promise<Group>;
  transferGroupOwner(params: TransferOwnerParams): Promise<Group>;
  hasAccess(params: AccessParams): Promise<User | undefined>;
  updateDetails(params: UpdateGroupDetailsParams): Promise<Group>;
  saveGroup(group: Group): Promise<Group>;
}
