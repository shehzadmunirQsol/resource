import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllDto {
  @IsInt()
  @Type(() => Number)
  first: number;

  @IsInt()
  @Type(() => Number)
  rows: number;

  @IsOptional()
  @IsString()
  search?: string;
}
