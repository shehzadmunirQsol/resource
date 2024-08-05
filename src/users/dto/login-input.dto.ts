import { Prisma } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginInputDto {
  @IsString()
  @IsNotEmpty()
  user_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
export class ResgiterInputDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  number: string;
  @IsString()
  @IsNotEmpty()
  role_id: string;
  @IsString()
  organization?: string;
  @IsString()
  plan_id?: string;
  @IsString()
  @IsNotEmpty()
  industry_id?: string;
  @IsString()
  @IsNotEmpty()
  nic: string;
  @IsString()
  @IsNotEmpty()
  country: string;
  @IsString()
  @IsNotEmpty()
  city: string;
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  confirm_password: string;
}
