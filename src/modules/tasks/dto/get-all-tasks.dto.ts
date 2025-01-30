import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class GetAllTasksQueryDto {
    @IsNumber()
    @Type(() => Number)
    pageNumber: number

    @IsNumber()
    @Type(() => Number)
    limit: number
}