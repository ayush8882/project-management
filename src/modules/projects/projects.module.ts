import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Projects, ProjectSchema } from './entities/project.entity';
import { ProjectMember, ProjectMemberSchema } from './entities/project-member.entity';
import { User, UserSchema } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Projects.name, schema: ProjectSchema},
      {name: ProjectMember.name, schema: ProjectMemberSchema},
      {name: User.name, schema: UserSchema}
    ]),
    UsersModule
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService]
})
export class ProjectsModule {}
