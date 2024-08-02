import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
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
  otp: string;
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
export class SendOtpDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
export class changePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  confirm_password: string;

  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
