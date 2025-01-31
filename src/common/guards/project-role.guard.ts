import { CanActivate, ExecutionContext, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export const RequiredProjectRoles = (...roles: string[]) => (SetMetadata('requiredProjectRoles', roles))

@Injectable()
export class ProjectRoleGuard implements CanActivate {
    constructor ( private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.get<string>('requiredProjectRoles', context.getHandler());
       
        if(!requiredRoles) return true;

        const request = context.switchToHttp().getRequest();
        const projectMember = request.projectMember;

        return requiredRoles.includes(projectMember.role)
    }
}