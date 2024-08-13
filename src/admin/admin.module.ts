import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RoleModule } from 'src/role/role.module';
import { RouterModule } from '@nestjs/core';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],

  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
