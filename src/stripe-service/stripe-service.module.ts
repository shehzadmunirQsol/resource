import { Module } from '@nestjs/common';
import { StripeService } from './stripe-service.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeServiceModule {}
