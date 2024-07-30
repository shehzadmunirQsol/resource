import { PartialType } from '@nestjs/mapped-types';
import { CreateJspDto } from './create-jsp.dto';

export class UpdateJspDto extends PartialType(CreateJspDto) {}
