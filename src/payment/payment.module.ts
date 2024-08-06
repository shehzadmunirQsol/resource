import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { DatabaseModule } from 'src/database/database.module';
import { StripeServiceModule } from 'src/stripe-service/stripe-service.module';
import { StripeService } from 'src/stripe-service/stripe-service.service';

@Module({
  imports: [DatabaseModule, StripeServiceModule],

  controllers: [PaymentController],
  providers: [PaymentService, StripeService],
})
export class PaymentModule {}
