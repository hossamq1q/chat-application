import { CreateGroupMessageParams, DeleteGroupMessageParams, EditGroupMessageParams } from "../../utils/types";
import { GroupMessage } from "../../utils/typeorm";

export interface IGroupMessageService{
  createGroupMessage(params:CreateGroupMessageParams)
  getGroupMessages(id:number):Promise<GroupMessage[]>
  deleteGroupMessage(params: DeleteGroupMessageParams);
  editGroupMessage(params: EditGroupMessageParams): Promise<GroupMessage>;
}