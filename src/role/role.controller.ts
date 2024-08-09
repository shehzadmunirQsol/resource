import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FindAllDto } from './dto/role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  findAllRole(
    @Query(new ValidationPipe({ transform: true }))
    { first, rows, search }: FindAllDto,
  ) {
    return this.roleService.findAll({ first, rows, search });
  }
  @Get('resources/:id')
  @UseGuards(JwtAuthGuard)
  findAllResource(
    @Param('id') id: string,
    @Query(new ValidationPipe({ transform: true }))
    { first, rows, search }: FindAllDto,
  ) {
    return this.roleService.findAllResource({ first, rows, search, id });
  }
  @Post('permission')
  @UseGuards(JwtAuthGuard)
  uploadPermission(@Body() createRoleDto: CreateRoleDto[]) {
    return this.roleService.uploadPermission(createRoleDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
