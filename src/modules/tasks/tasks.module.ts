import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tasks, TasksSchema } from './entities/task.entity';
import { ProjectsModule } from '../projects/projects.module';
import { ProjectMember, ProjectMemberSchema } from '../projects/entities/project-member.entity';
import { NotificationGateway } from '../notification/notification.gateway';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MongooseModule.forFeature([
    {name: Tasks.name, schema: TasksSchema}, 
    {name: ProjectMember.name, schema: ProjectMemberSchema}
  ]), 
  ProjectsModule, 
  NotificationGateway,
  UsersModule,
  ScheduleModule.forRoot()
],
  controllers: [TasksController],
  providers: [TasksService, NotificationGateway],
  exports: [TasksService]
})
export class TasksModule {}
