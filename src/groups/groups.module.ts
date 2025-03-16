import { Module } from '@nestjs/common';
import { GroupController } from "./controllers/group.controller";
import { Services } from "../utils/constants";
import { GroupService } from "./services/group.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Group } from "../utils/typeorm";
import { UsersModule } from "../users/users.module";

@Module({
  imports:[UsersModule,TypeOrmModule.forFeature([Group])],
  controllers: [GroupController],
  providers: [{provide:Services.GROUPS , useClass:GroupService}]
})
export class GroupsModule {}
