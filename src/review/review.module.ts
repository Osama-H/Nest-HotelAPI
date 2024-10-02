import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from './review.model';
import { HotelModule } from 'src/hotel/hotel.module';
import { RoomModule } from 'src/room/room.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { BookingModule } from 'src/booking/booking.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Review]),
    HotelModule,
    RoomModule,
    AuthModule,
    UserModule,
    BookingModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
