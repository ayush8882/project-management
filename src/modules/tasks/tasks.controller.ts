import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskQueryFilterDto } from './dto/get-task-by-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetAllTasksQueryDto } from './dto/get-all-tasks.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ProjectAccessGuard } from 'src/common/guards/project-access.guard';
import { RequiredProjectRoles } from 'src/common/guards/project-role.guard';
import { TaskAccessGuard } from 'src/common/guards/task-access.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('project/:projectId')
  @UseGuards(AuthGuard, ProjectAccessGuard)
  @RequiredProjectRoles('ADMIN', 'OWNER', 'MEMBER')
  async create(@Body() createTaskDto: CreateTaskDto, @Param('projectId') projectId: string) {
    return await this.tasksService.create(projectId, createTaskDto);
  }

  @Get('project/:projectId')
  @UseGuards(AuthGuard, ProjectAccessGuard)
  @RequiredProjectRoles('ADMIN', 'OWNER', 'MEMBER', 'VIEWER')
  async findAllTaskOfProject(
    @Param('projectId') projectId: string, 
    @Query() pagination: GetAllTasksQueryDto
  ) {
    return await this.tasksService.findAllProjectTasks(projectId, pagination);
  }

  @Patch(':taskId/project/:projectId')
  @UseGuards(AuthGuard, TaskAccessGuard, ProjectAccessGuard)
  @RequiredProjectRoles('ADMIN', 'OWNER', 'MEMBER')
  async update(
    @Param('taskId') taskId: string, 
    @Param('projectId') projectId: string, 
    @Body() updateTaskDto: UpdateTaskDto
  ) {
    return await this.tasksService.updateProjectTask(taskId, projectId, updateTaskDto);
  }

  @Delete(':taskId')
  @UseGuards(AuthGuard, TaskAccessGuard, ProjectAccessGuard)
  @RequiredProjectRoles('ADMIN', 'OWNER', 'MEMBER')
  async remove(@Param('taskId') taskId: string) {
    return await this.tasksService.remove(taskId);
  }

  @Get('project/:projectId/query')
  @UseGuards(AuthGuard, ProjectAccessGuard)
  @RequiredProjectRoles('ADMIN', 'OWNER', 'MEMBER', 'VIEWER')
  async filterByQuery(@Param('projectId') projectId: string, @Query() filterQueries: TaskQueryFilterDto){
    return await this.tasksService.filterByQuery(projectId, filterQueries)
  }
}
