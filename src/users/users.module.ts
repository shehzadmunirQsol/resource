import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import PasswordHash from 'src/auth/password.hash';
import { EmailController } from 'src/email/email.controller';
import { EmailService } from 'src/email/email.service';
// import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController, EmailController],
  providers: [UsersService, PasswordHash, EmailService],
  exports: [UsersService],
})
export class UsersModule {}
