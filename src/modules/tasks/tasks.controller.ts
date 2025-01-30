import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskQueryFilterDto } from './dto/get-task-by-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetAllTasksQueryDto } from './dto/get-all-tasks.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('project/:projectId')
  async create(@Body() createTaskDto: CreateTaskDto, @Param('projectId') projectId: string) {
    return await this.tasksService.create(projectId, createTaskDto);
  }

  @Get('project/:projectId')
  async findAllTaskOfProject(@Param('projectId') projectId: string, @Query() pagination: GetAllTasksQueryDto) {
    return await this.tasksService.findAllProjectTasks(projectId, pagination);
  }

  @Patch(':id/project/:projectId')
  async update(@Param('id') id: string, @Param('projectId') projectId: string, @Body() updateTaskDto: UpdateTaskDto) {
    return await this.tasksService.updateProjectTask(id, projectId, updateTaskDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.tasksService.remove(id);
  }

  @Get('project/:projectId/query')
  async filterByQuery(@Param('projectId') projectId: string, @Query() filterQueries: TaskQueryFilterDto){
    return await this.tasksService.filterByQuery(projectId, filterQueries)
  }
}
