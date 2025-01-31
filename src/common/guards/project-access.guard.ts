import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { ProjectsService } from "src/modules/projects/projects.service";

@Injectable()
export class ProjectAccessGuard implements CanActivate {
    constructor(
        private readonly projectService: ProjectsService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const projectId = request.params.projectId

        if(!projectId) return false;
        const projectDetails = await this.projectService.findById(projectId);
        if(projectDetails?.owner?.toString() === user?.id){
            return true
        }
        const member = await this.projectService.findMemberOfProject(projectId, user?.id)
        if(!member) throw new ForbiddenException('You do not have access to the project!')
        return true
    }
}