import { CreateGroupParams, FetchGroupsParams, TransferOwnerParams } from "../../utils/types";
import { Group } from '../../utils/typeorm';

export interface IGroupService {
  createGroup(params: CreateGroupParams): Promise<Group>;
  getGroups(params: FetchGroupsParams): Promise<Group[]>;
  findGroupById(id: number): Promise<Group>;
  transferGroupOwner(params: TransferOwnerParams): Promise<Group>;
}
