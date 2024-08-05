import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreatePaymentDto {}

export class CreateStripePaymentDto {
  @IsString()
  @IsNotEmpty()
  stripeToken: string;
  @IsString()
  @IsNotEmpty()
  token: string;
}
