import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PspsService } from './psps.service';
import { CreatePspDto } from './dto/create-psp.dto';
import { UpdatePspDto } from './dto/update-psp.dto';

@Controller('psps')
export class PspsController {
  constructor(private readonly pspsService: PspsService) {}

  @Post()
  create(@Body() createPspDto: CreatePspDto) {
    return this.pspsService.create(createPspDto);
  }

  @Get()
  findAll() {
    return this.pspsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pspsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePspDto: UpdatePspDto) {
    return this.pspsService.update(+id, updatePspDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pspsService.remove(+id);
  }
}
