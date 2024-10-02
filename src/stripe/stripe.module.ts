import { Module } from '@nestjs/common';
import { StripeModule as NestStripeModule } from 'nestjs-stripe';
import { ConfigModule } from '@nestjs/config';
import { StripeService } from './stripe.service';

@Module({
  imports: [
    NestStripeModule.forRoot({
      apiKey:
        'sk_test_51Pfx2TGodwdGCaNoZw1GHcZhzS4d6uNZDN9Qz9y49qLzoUFbXByDrwpbWhTNapCodxUcQ9znkH7RlbQa41KtF44B006bEOBk3A',

      apiVersion: '2024-06-20',
    }),
  ],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
