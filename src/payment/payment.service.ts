import { Injectable } from '@nestjs/common';
import { CreatePaymentDto, CreateStripePaymentDto } from './dto/payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PaymentService {
  constructor(private jwtService: JwtService) {}
  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }

  stripePay(createPaymentDto: CreateStripePaymentDto) {
    console.log({ createPaymentDto });
    const accessToken = this.jwtService.verify(createPaymentDto?.stripeToken);

    return 'This action adds a new payment';
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
