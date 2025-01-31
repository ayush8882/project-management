import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { PROJECT_USER_ROLES } from "src/common/enums/role.enum";

export class ProjectMemberDto {
  @IsEnum(PROJECT_USER_ROLES)
  role: string

  @IsString()
  id: string
}

export class UpdateProjectDto {

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectMemberDto)
  @IsOptional()
  project_members?: ProjectMemberDto[];
}