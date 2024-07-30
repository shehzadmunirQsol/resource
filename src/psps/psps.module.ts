import { Module } from '@nestjs/common';
import { PspsService } from './psps.service';
import { PspsController } from './psps.controller';

@Module({
  controllers: [PspsController],
  providers: [PspsService],
})
export class PspsModule {}
