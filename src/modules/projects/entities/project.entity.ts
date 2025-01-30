import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

export type ProjectDocument = Projects & Document

@Schema({timestamps: true})
export class Projects extends Document {

    @Prop({required: true})
    name: string

    @Prop({required: true})
    description: string

    @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'ProjectMember', required: false })
    project_members: MongooseSchema.Types.ObjectId[];

    @Prop({required: false, default: false})
    is_deleted: boolean
}

export const ProjectSchema = SchemaFactory.createForClass(Projects)
