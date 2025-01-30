import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { TASK_PRIORITY } from "src/common/enums/task-priotrity.enum";
import { TASK_STATUS } from "src/common/enums/task-status.enum";

export class CreateTaskDto {

    @IsString()
    name: string

    @IsString()
    description: string

    @IsOptional()
    @IsEnum(TASK_STATUS)
    status?: TASK_STATUS

    @IsOptional()
    @IsEnum(TASK_PRIORITY)
    priority?: TASK_PRIORITY

    @Type(() => Date)
    @IsOptional()
    due_date?: string
}