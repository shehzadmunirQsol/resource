import {
  MinLength,
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class MainInfo {
  @IsOptional()
  @IsString()
  user_name?: string;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  picture?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

class ContactInfo {
  @IsOptional()
  @IsString()
  billing_country?: string;

  @IsOptional()
  @IsString()
  billing_state?: string;

  @IsOptional()
  @IsString()
  billing_city?: string;

  @IsOptional()
  @IsString()
  billing_address_1?: string;

  @IsOptional()
  @IsString()
  billing_address_2?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  billing_postcode?: string;
}

export class ProfileDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @ValidateNested()
  @Type(() => MainInfo)
  main: MainInfo;

  @ValidateNested()
  @Type(() => ContactInfo)
  contact: ContactInfo;
}
