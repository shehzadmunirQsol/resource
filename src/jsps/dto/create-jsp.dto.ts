import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
export class CreateJspDto {
  id?: number;
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsBoolean()
  @IsNotEmpty()
  is_enabled: boolean;
  @IsNumber()
  @IsNotEmpty()
  module_id: number;
  @IsDate()
  created_on: Date;
  @IsDate()
  updated_on: Date;
}
