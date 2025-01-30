import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { TASK_PRIORITY } from "src/common/enums/task-priotrity.enum";
import { TASK_STATUS } from "src/common/enums/task-status.enum";

export type TaskDocument = Tasks & Document

@Schema({timestamps: true})
export class Tasks extends Document {

    @Prop({required: true})
    name: string

    @Prop({required: true})
    description: string

    @Prop({type: Types.ObjectId, ref: 'Project', required: true})
    project_id: Types.ObjectId

    @Prop({type: Types.ObjectId, ref: 'User', required: false})
    assigned_user: Types.ObjectId

    @Prop({required: true, enum: TASK_STATUS, default: TASK_STATUS.OPEN})
    status: string

    @Prop({required: true, enum: TASK_PRIORITY, default: TASK_PRIORITY.MEDIUM})
    priority: string

    @Prop({required: true})
    due_date: Date

    @Prop({required: false, default: false})
    is_deleted: boolean
}

export const TasksSchema = SchemaFactory.createForClass(Tasks)
