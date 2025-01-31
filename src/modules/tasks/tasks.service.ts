import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';
import { InjectModel } from '@nestjs/mongoose';
import { TaskDocument, Tasks } from './entities/task.entity';
import { Model, Types } from 'mongoose';
import { ProjectMember, ProjectMemberDocument } from '../projects/entities/project-member.entity';
import { TaskQueryFilterDto } from './dto/get-task-by-filter.dto';
import { NotificationGateway } from '../notification/notification.gateway';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetAllTasksQueryDto } from './dto/get-all-tasks.dto';
import { TaskActivityService } from '../activity-log/task-activity.service';

@Injectable()
export class TasksService {
  constructor (
    private readonly projectService: ProjectsService, 
    private readonly taskActivityService: TaskActivityService,
    private readonly notificationGateway: NotificationGateway,
    @InjectModel(Tasks.name) private readonly taskModel : Model<TaskDocument>,
    @InjectModel(ProjectMember.name) private readonly projectMemberModel : Model<ProjectMemberDocument>
  ) {}

  async create(projectId:string, createTaskDto: CreateTaskDto, user: any) {
    const projectDetails = await this.projectService.findById(projectId);
    if(!projectDetails) { throw new BadRequestException('Project does not exists')}

    const taskObject = {...createTaskDto, project_id: projectDetails._id}
    const newTaskInstance = new this.taskModel({
      ...taskObject,
      owner: user._id
    })
    const response = (await newTaskInstance.save())
    this.notificationGateway.notifyTaskUpdates(response)
    await this.taskActivityService.logActivity(response?.id, user?._id?.toString(), 'New Task has been created', {
      name: response?.name,
      description: response?.description
    })
    return response;
  }

  async findAllProjectTasks(projectId: string, pagination: GetAllTasksQueryDto) {
    const { pageNumber = 0, limit = 10 } = pagination;
    const tasks = await this.taskModel.aggregate([
      { $match: { project_id: new Types.ObjectId(projectId), is_deleted: false } },
      {
        $facet: {
          data: [
            { $skip: pageNumber * limit },
            { $limit: limit }
          ],
          totalCount: [
            { $count: 'count' }
          ]
        }
      }
    ]);
    const allTasks = tasks[0].data;
    const totalCount = tasks[0].totalCount[0] ? tasks[0].totalCount[0].count : 0;

    return {allTasks, pagination: {
      pageNumber,
      limit, 
      totalPages: totalCount
    }};
  }

  async updateProjectTask(id: string, projectId: string, updateTaskDto: UpdateTaskDto, userId: string) {
    if(updateTaskDto.assigned_user){
      const projectMember = await this.projectMemberModel.find({
        project_id: projectId,
        user: updateTaskDto.assigned_user
      })
      if(!projectMember) { throw new BadRequestException('User does not has access to the project')}
      updateTaskDto.assigned_user = new Types.ObjectId(updateTaskDto.assigned_user)
    }

    const oldTask = await this.taskModel.findById(id);
    if(!oldTask) { throw new BadRequestException('Task does not exists')}
    const response = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, {new: true}).exec()
    const changes = this.getChanges(oldTask.toObject(), response?.toObject());
    const description = this.generateActivityDescription(changes)
    await this.taskActivityService.logActivity(id, userId, description, changes)
    this.notificationGateway.notifyTaskUpdates(response)
    return response
  }

  async remove(id: string) {
    const response = await this.taskModel.findByIdAndUpdate(id, {
      is_deleted: true
    }, {new: true})
    this.notificationGateway.notifyTaskUpdates(response)
    return {
      message: 'Task deleted successfully'
    };
  }

  async filterByQuery(projectId: string, filterQueries: TaskQueryFilterDto) {
    const filterQuery = {
      project_id: new Types.ObjectId(projectId),
      ...(filterQueries.status && {status: filterQueries.status}),
      ...(filterQueries.due_date_start && filterQueries.due_date_end && {
          due_date: { $gte: filterQueries.due_date_start, $lte: filterQueries.due_date_end }
        }),
      ...(filterQueries.priority && {priority: filterQueries.priority}),
      ...(filterQueries.assigned_user && {assigned_user: new Types.ObjectId(filterQueries.assigned_user)}),
    }
    console.log(filterQuery)
    return await this.taskModel.find(filterQuery).exec()
  }

  async findById(taskId: string) {
    const response = await this.taskModel.findById(taskId);
    return response;
  }

  private getChanges(oldTask: any, newTask: any): Record<string, any> {
    const changes: Record<string, any> = {};

    for (const [key, value] of Object.entries(newTask)){
      if(oldTask[key] !== value && key !== '_id' && key !== '__v'){
        changes[key] = {
          from: oldTask[key],
          to: value
        }
      }
    }
    return changes;
  }

  private generateActivityDescription(changes: Record<string, any>): string {
    const description: string[] = []

    for (const [key, value] of Object.entries(changes)){
      switch (key) {
        case 'status':
          description.push(`changes status from "${value.from}" to "${value.to}"`);
          break;
        case 'priority':
          description.push(`changes priority from "${value.from}" to "${value.to}"`);
          break;
        case 'name':
          description.push(`changes name from "${value.from}" to "${value.to}"`);
          break;
        case 'description':
          description.push(`changes description from "${value.from}" to "${value.to}"`);
          break;
        case 'due_date':
          description.push(`changes due_date from "${value.from}" to "${value.to}"`);
          break;
        case 'assigned_user':
          description.push(`changes assigned_user from "${value.from}" to "${value.to}"`);
          break;
        default:
          description.push(`updated ${key}`)
      }
    }
    return description.join(', ')
  }

  @Cron('* * 1 * * *')
  async dueByNotification(){
    console.log('cron executing');
    const startTime = moment(); // current date & time
    const endTime = startTime.clone().add(24, 'hours'); // 24 hours from now
    console.log(new Date(), startTime, endTime)
    const tasks = await this.taskModel.find({
        due_date: { $gte: startTime, $lte: endTime }
    })
    console.log(tasks)
  }
}
