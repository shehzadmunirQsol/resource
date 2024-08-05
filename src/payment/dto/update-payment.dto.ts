import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDto } from './payment.dto';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}
