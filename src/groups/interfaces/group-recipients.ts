import {
  AddGroupRecipientParams,
  AddGroupUserResponse, LeaveGroupParams,
  RemoveGroupRecipientParams,
  RemoveGroupUserResponse
} from "../../utils/types";
import { Group } from "../../utils/typeorm";

export interface IGroupRecipientsService {
  addGroupRecipient(
    params: AddGroupRecipientParams,
  ): Promise<AddGroupUserResponse>;

  removeGroupRecipient(
    params: RemoveGroupRecipientParams,
  ): Promise<RemoveGroupUserResponse>;

  leaveGroup(params:LeaveGroupParams):Promise<Group>;
}
