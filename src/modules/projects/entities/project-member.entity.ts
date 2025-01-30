import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { PROJECT_USER_ROLES } from "src/common/enums/role.enum";

export type ProjectMemberDocument = ProjectMember & Document

@Schema({timestamps: true})
export class ProjectMember extends Document {

    @Prop({required: true})
    role: PROJECT_USER_ROLES

    @Prop({type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, unique: false})
    user: MongooseSchema.Types.ObjectId

    @Prop({type: MongooseSchema.Types.ObjectId, ref: 'Project', required: true, unique: false})
    project_id: MongooseSchema.Types.ObjectId
}

export const ProjectMemberSchema = SchemaFactory.createForClass(ProjectMember)
