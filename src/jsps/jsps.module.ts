import { Module } from '@nestjs/common';
import { JspsService } from './jsps.service';
import { JspsController } from './jsps.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],

  controllers: [JspsController],
  providers: [JspsService],
})
export class JspsModule {}
