import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({timestamps: true})
export class TaskActivity {
    @Prop({type: Types.ObjectId, ref: 'Task', required: true})
    task_id: Types.ObjectId

    @Prop({type: Types.ObjectId, ref: 'User', required: true})
    user_id: Types.ObjectId

    @Prop({type: Object})
    changes: Record<string, any>

    @Prop({required: true})
    description: string
}

export type TaskActivityDocument  = TaskActivity & Document

export const TaskActivitySchema = SchemaFactory.createForClass(TaskActivity);