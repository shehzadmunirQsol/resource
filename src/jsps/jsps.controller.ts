import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JspsService } from './jsps.service';
import { CreateJspDto } from './dto/create-jsp.dto';
import { UpdateJspDto } from './dto/update-jsp.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('jsps')
export class JspsController {
  constructor(private readonly jspsService: JspsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createJspDto: any) {
    return this.jspsService.create(createJspDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.jspsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jspsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJspDto: UpdateJspDto) {
    return this.jspsService.update(+id, updateJspDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jspsService.remove(+id);
  }
}
