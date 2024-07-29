import { IsInt, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAllUsersDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) || parsed < 0 ? undefined : parsed;
  })
  rows?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) || parsed < 0 ? undefined : parsed;
  })
  skip?: number;
}
