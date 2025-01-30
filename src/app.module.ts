import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { MongoModule } from './db/mongo.config';
import { TasksModule } from './modules/tasks/tasks.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [MongoModule, UsersModule, AuthModule, ProjectsModule, TasksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
