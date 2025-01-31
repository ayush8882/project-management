import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ProjectAccessGuard } from 'src/common/guards/project-access.guard';
import { RequiredProjectRoles } from 'src/common/guards/project-role.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createProjectDto: CreateProjectDto, @Request() req: any) {
    const user = req.user;
    return await this.projectsService.create(createProjectDto, user);
  }

  @Patch(':projectId')
  @UseGuards(AuthGuard, ProjectAccessGuard)
  @RequiredProjectRoles('ADMIN', 'OWNER', 'MEMBER')
  async update(@Param('projectId') projectId: string, @Body() updateProjectDto: UpdateProjectDto) {
    return await this.projectsService.update(projectId, updateProjectDto);
  }

  @Delete(':projectId/user/:userId')
  @UseGuards(AuthGuard, ProjectAccessGuard)
  @RequiredProjectRoles('ADMIN', 'OWNER')
  async removeCollbaorator(@Param('projectId') projectId: string, @Param('userId') userId: string){
    return await this.projectsService.removeCollaborator(projectId, userId)
  }

  @Delete(':projectId')
  @UseGuards(AuthGuard, ProjectAccessGuard)
  @RequiredProjectRoles('ADMIN', 'OWNER')
  async archiveProject(@Param('projectId') projectId: string){
    return await this.projectsService.archiveProject(projectId)
  }

}
