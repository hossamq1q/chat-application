import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GroupController } from './controllers/group.controller';
import { Services } from '../utils/constants';
import { GroupService } from './services/group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group, GroupMessage } from '../utils/typeorm';
import { UsersModule } from '../users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from '../utils/multerConfiguration';
import { GroupRecipientsController } from './controllers/group-recipients.controller';
import { GroupRecipientsService } from './services/group-recipients.service';
import { GroupMessageController } from './controllers/group-message.controller';
import { GroupMessageService } from './services/group-message.service';
import { GroupMiddleware } from './middlewares/group.middleware';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Group, GroupMessage]),
    MulterModule.register(multerOptions),
  ],
  controllers: [
    GroupController,
    GroupRecipientsController,
    GroupMessageController,
  ],
  providers: [
    { provide: Services.GROUPS, useClass: GroupService },
    { provide: Services.GROUP_RECIPIENTS, useClass: GroupRecipientsService },
    { provide: Services.GROUP_MESSAGES, useClass: GroupMessageService },
  ],
})
export class GroupsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GroupMiddleware).forRoutes('groups/:id');
  }
}
