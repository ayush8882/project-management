import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TaskActivity, TaskActivitySchema } from "./entities/task-activity.entity";
import { TaskActivityService } from "./task-activity.service";

@Module({
    imports: [MongooseModule.forFeature([
        {name: TaskActivity.name, schema: TaskActivitySchema}
    ])],
    providers: [TaskActivityService],
    exports: [TaskActivityService]
})

export class TaskActivityModule {};