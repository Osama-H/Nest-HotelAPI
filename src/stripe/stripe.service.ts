import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(@InjectStripe() private readonly stripeClient: Stripe) {}

  async createCharge(amount: number, source: string, currency: string) {
    return this.stripeClient.charges.create({
      amount,
      currency,
      source,
    });
  }
}
