import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { EmailService } from 'src/email/email.service';
import Stripe from 'stripe';
import { createCustomerDto } from './dto/stripe.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly db: DatabaseService,
    // private readonly emailService: EmailService = new EmailService(this.db),
  ) {
    this.initializeStripe();
  }
  async getStripeKeys(): Promise<any> {
    const stirpeKeys = await this.db.adminSettings.findFirst({
      where: {
        type: 'stripe',
      },
    });
    return stirpeKeys;
  }
  private async initializeStripe() {
    const secretKey = await this.getStripeKeys();
    this.stripe = new Stripe(secretKey?.secret_key, {
      apiVersion: '2024-06-20',
    });
  }

  async createStripeCustomer(createDto: createCustomerDto): Promise<any> {
    return await this.stripe.customers.create(createDto);
  }
}
