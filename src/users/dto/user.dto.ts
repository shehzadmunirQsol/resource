import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class ModuleDto {
  id?: number;

  user_id: number;

  is_enabled: boolean;

  module_id: number;
  created_on: Date;
  updated_on: Date;
}
export class FindAllDto {
  @IsOptional()
  @IsString()
  @IsInt()
  @Type(() => Number)
  first: number;
  @IsOptional()
  @IsString()
  @IsInt()
  @Type(() => Number)
  rows: number;

  @IsOptional()
  @IsString()
  search?: string;
  @IsOptional()
  @IsString()
  type?: string;
}
