import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateRoleDto {}
export class CreatePermissionDto {
  @IsOptional()
  @IsString()
  acces: string;

  @IsOptional()
  @IsString()
  resource_id: string;

  @IsOptional()
  @IsString()
  role_id?: string;
}
