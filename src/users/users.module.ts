import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import PasswordHash from 'src/auth/password.hash';
import { EmailController } from 'src/email/email.controller';
import { EmailService } from 'src/email/email.service';
import { StripeServiceModule } from 'src/stripe-service/stripe-service.module';
import { StripeService } from 'src/stripe-service/stripe-service.service';
// import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, StripeServiceModule],
  controllers: [UsersController, EmailController],
  providers: [UsersService, PasswordHash, EmailService, StripeService],
  exports: [UsersService],
})
export class UsersModule {}
