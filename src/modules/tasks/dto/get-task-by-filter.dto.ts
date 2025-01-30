import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { TASK_PRIORITY } from "src/common/enums/task-priotrity.enum";
import { TASK_STATUS } from "src/common/enums/task-status.enum";

export class TaskQueryFilterDto {

    @IsOptional()
    @IsEnum(TASK_STATUS)
    status?: TASK_STATUS

    @IsOptional()
    @IsEnum(TASK_PRIORITY)
    priority?: TASK_PRIORITY

    @Type(() => Date)
    @IsOptional()
    due_date_start?: string

    @Type(() => Date)
    @IsOptional()
    due_date_end?: string

    @IsString()
    @IsOptional()
    assigned_user?: string
}