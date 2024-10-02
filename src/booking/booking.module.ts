import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Booking } from './booking.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { StripeModule } from 'src/stripe/stripe.module';
import { RoomModule } from 'src/room/room.module';
import { CouponModule } from 'src/coupon/coupon.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Booking]),
    RoomModule,
    UserModule,
    AuthModule,
    CouponModule,
    StripeModule,
  ],
  controllers: [BookingController],
  providers: [BookingService, EmailService],
  exports: [BookingService],
})
export class BookingModule {}
