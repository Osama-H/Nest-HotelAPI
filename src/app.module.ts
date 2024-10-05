import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { HotelModule } from './hotel/hotel.module';
import { RoomModule } from './room/room.module';
import { AuthModule } from './auth/auth.module';
import { EmailService } from './email/email.service';
import { CountryModule } from './country/country.module';
import { CityModule } from './city/city.module';
import { StripeModule } from './stripe/stripe.module';
import { BookingModule } from './booking/booking.module';
import { SupportTicketModule } from './support-ticket/support-ticket.module';
import { TicketSubjectModule } from './ticket-subject/ticket-subject.module';
import { TicketResultModule } from './ticket-result/ticket-result.module';
import { ReviewModule } from './review/review.module';
import { CustomCacheModule } from './cache/cache.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { RoomTypeModule } from './room-type/room-type.module';
import { AmenityModule } from './amenity/amenity.module';
import { HotelAmenityModule } from './hotel-amenity/hotel-amenity.module';
import { RolesGuard } from './auth/guards/role.guard';
import { RoleModule } from './role/role.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { CouponModule } from './coupon/coupon.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { TicketStatusModule } from './ticket-status/ticket-status.module';
import { EmailController } from './email/email.controller';
import { EmailModule } from './email/email.module';
import { UploadModule } from './upload/upload.module';
import { HotelPhotoModule } from './hotel-photo/hotel-photo.module';

@Module({
  imports: [
    CustomCacheModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    DatabaseModule,
    UserModule,

    HotelModule,
    RoomModule,
    AuthModule,
    CountryModule,
    CityModule,
    StripeModule,
    BookingModule,
    SupportTicketModule,
    TicketSubjectModule,
    TicketResultModule,
    ReviewModule,
    RoomTypeModule,
    AmenityModule,
    HotelAmenityModule,
    RoleModule,
    CloudinaryModule,
    CouponModule,
    TicketStatusModule,
    EmailModule,
    UploadModule,
    HotelPhotoModule,
  ],
  controllers: [AppController, UserController, EmailController],
  providers: [
    AppService,
    EmailService,
    //TODO: uncomment this after testing
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
  ],
})
export class AppModule {}
