import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    return await this.projectsService.create(createProjectDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return await this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id/user/:userId')
  async removeCollbaorator(@Param('id') id: string, @Param('userId') userId: string){
    return await this.projectsService.removeCollaborator(id, userId)
  }

  @Delete(':id/')
  async archiveProject(@Param('id') id: string){
    return await this.projectsService.archiveProject(id)
  }

}
