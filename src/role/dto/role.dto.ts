import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  first: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  rows: number;

  @IsOptional()
  @IsString()
  search?: string;
}
