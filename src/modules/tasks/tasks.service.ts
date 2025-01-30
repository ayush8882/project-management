import { BadRequestException, Injectable } from '@nestjs/common';
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

@Injectable()
export class TasksService {
  constructor (
    private readonly projectService: ProjectsService, 
    private readonly notificationGateway: NotificationGateway,
    @InjectModel(Tasks.name) private readonly taskModel : Model<TaskDocument>,
    @InjectModel(ProjectMember.name) private readonly projectMemberModel : Model<ProjectMemberDocument>
  ) {}

  async create(projectId:string, createTaskDto: CreateTaskDto) {
    const projectDetails = await this.projectService.findById(projectId);
    if(!projectDetails) { throw new BadRequestException('Project does not exists')}

    const taskObject = {...createTaskDto, project_id: projectDetails._id}
    const newTaskInstance = new this.taskModel({
      ...taskObject,
    })
    const response = (await newTaskInstance.save())
    this.notificationGateway.notifyTaskUpdates(response)
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

  async updateProjectTask(id: string, projectId: string, updateTaskDto: UpdateTaskDto) {
    if(updateTaskDto.assigned_user){
      const projectMember = await this.projectMemberModel.find({
        project_id: projectId,
        user: updateTaskDto.assigned_user
      })
      if(!projectMember) { throw new BadRequestException('User does not has access to the project')}
      updateTaskDto.assigned_user = new Types.ObjectId(updateTaskDto.assigned_user)
    }

    const response = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, {new: true}).exec()
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
