import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { InvalidGroupException } from "../exceptions/invalidGroup";
import { Services } from "../../utils/constants";
import { IGroupService } from "../interfaces/group";
import { GroupNotFoundException } from "../exceptions/groupNotFound";

@Injectable()
export class GroupMiddleware implements NestMiddleware {
  constructor(@Inject(Services.GROUPS)private readonly groupService:IGroupService){}
  async use(req: any, res: any, next: (error?: any) => void) {
    const { id: userId } = req.user;
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new InvalidGroupException();
    const user = await this.groupService.hasAccess({ id, userId });
    if (user) next();
    else throw new GroupNotFoundException();
  }
}
