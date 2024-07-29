import {
  MinLength,
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

class MainInfo {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (!value ? '' : value))
  first_name?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (!value ? '' : value))
  full_name?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (!value ? '' : value))
  last_name?: string;

  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => (!value ? undefined : value))
  email?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (!value ? '' : value))
  picture?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (!value ? '' : value))
  phone?: string;
}

class ContactInfo {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (!value ? '' : value))
  billing_country?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (!value ? '' : value))
  billing_state?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (!value ? '' : value))
  billing_city?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (!value ? '' : value))
  billing_address_1?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (!value ? '' : value))
  billing_address_2?: string;

  @ValidateIf((_) => _.billing_postcode !== '')
  @IsOptional()
  @IsString()
  @MinLength(2)
  @Transform(({ value }) => (!value ? '' : value))
  billing_postcode?: string;
}

export class ProfileUpdateDto {
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
