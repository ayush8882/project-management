import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { TaskActivity } from "./entities/task-activity.entity";
import { Model, Types } from "mongoose";

@Injectable()
export class TaskActivityService {
    constructor (
        @InjectModel(TaskActivity.name) private readonly taskActivityModel: Model<TaskActivity>
    ) {}

    async logActivity (
        taskId: string,
        userId: string,
        description: string,
        changes?: Record<string, any>
    ) {
        const activity = new this.taskActivityModel({
            task_id: new Types.ObjectId(taskId),
            user_id: new Types.ObjectId(userId),
            description,
            changes
        })

        return activity.save()
    }

    async getTaskActivity(taskId: string) {
        return await this.taskActivityModel.find({task_id: taskId})
            .sort({ createdAt: -1 })
            .populate('user_id', 'name email username')
            .exec()
    }
}