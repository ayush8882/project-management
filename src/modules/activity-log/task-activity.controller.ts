import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { TaskActivityService } from "./task-activity.service";
import { AuthGuard } from "src/common/guards/auth.guard";
import { TaskAccessGuard } from "src/common/guards/task-access.guard";

@Controller('task-activity')
export class TaskActivityController {
    constructor (
        private readonly taskActivityService: TaskActivityService
    ) {}

    @Get(':taskId')
    @UseGuards(AuthGuard, TaskAccessGuard)
    async getTaskActivity(@Param('taskId') taskId: string) {
        return await this.taskActivityService.getTaskActivity(taskId)
    }
}