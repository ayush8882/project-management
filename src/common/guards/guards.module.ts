import { Module } from "@nestjs/common";
import { ProjectsModule } from "src/modules/projects/projects.module";
import { TasksModule } from "src/modules/tasks/tasks.module";
import { UsersModule } from "src/modules/users/users.module";
import { AuthGuard } from "./auth.guard";
import { ProjectAccessGuard } from "./project-access.guard";
import { TaskAccessGuard } from "./task-access.guard";
import { ProjectRoleGuard } from "./project-role.guard";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET ?? 'testKey',
            signOptions: {expiresIn: '24h'}
        }),
        ProjectsModule,
        UsersModule,
        TasksModule,
    ],
    providers: [
        AuthGuard,
        ProjectAccessGuard,
        ProjectRoleGuard,
        TaskAccessGuard
    ],
    exports: [
        AuthGuard,
        ProjectAccessGuard,
        ProjectRoleGuard,
        TaskAccessGuard
    ]
})

export class GuardModule {};