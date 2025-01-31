import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { MongoModule } from './db/mongo.config';
import { TasksModule } from './modules/tasks/tasks.module';
import { AuthModule } from './modules/auth/auth.module';
import { GuardModule } from './common/guards/guards.module';

@Module({
  imports: [MongoModule, GuardModule, UsersModule, AuthModule, ProjectsModule, TasksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
