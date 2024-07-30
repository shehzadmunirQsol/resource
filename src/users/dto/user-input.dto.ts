import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class ModuleInputDto {
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

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  otp: number;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
