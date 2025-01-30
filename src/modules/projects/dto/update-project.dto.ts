import { IsArray, IsEnum, IsString, ValidateNested } from "class-validator";
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
  name?: string;

  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectMemberDto)
  project_members?: ProjectMemberDto[];
}