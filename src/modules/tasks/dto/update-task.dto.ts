import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { TASK_PRIORITY } from "src/common/enums/task-priotrity.enum";
import { TASK_STATUS } from "src/common/enums/task-status.enum";

export class UpdateTaskDto {

    @IsString()
    @IsOptional()
    name?: string

    @IsString()
    @IsOptional()
    description?: string

    @IsOptional()
    @IsEnum(TASK_STATUS)
    status?: TASK_STATUS

    @IsOptional()
    @IsEnum(TASK_PRIORITY)
    priority?: TASK_PRIORITY

    @Type(() => Date)
    @IsOptional()
    due_date?: string

    @IsString()
    @IsOptional()
    assigned_user?: string | Types.ObjectId
}