import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { ProjectsService } from "src/modules/projects/projects.service";
import { TasksService } from "src/modules/tasks/tasks.service";

@Injectable()
export class TaskAccessGuard implements CanActivate {
    constructor (
        private readonly taskService: TasksService,
        private readonly projectService: ProjectsService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const taskId = request.params.taskId;

        if(!taskId) {throw new BadRequestException('Task does not exists')};

        const task = await this.taskService.findById(taskId);
        if(!task) {throw new BadRequestException('Task does not exists')};

        // if project owner opens => allow
        const projectDetails = await this.projectService.findById(task?.project_id?.toString());
        if(projectDetails?.owner?.toString() === user?.id){
            return true
        }

        // if member opens => allow
        const memberDetails = await this.projectService.findMemberOfProject(task?.project_id?.toString(), user?.id);

        if(!memberDetails) { throw new ForbiddenException('You do not have access to the task')}
        request.projectMember = memberDetails
        return true;
    }
}