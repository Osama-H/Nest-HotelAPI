import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/user.model';
import { Hotel } from 'src/hotel/models/hotel.model';
import { Room } from 'src/room/room.model';
import { Country } from 'src/country/country.model';
import { City } from 'src/city/city.model';
import { ContactInfo } from 'src/hotel/models/contactInfo.model';
import { Dialect } from 'sequelize';
import { RoomType } from 'src/room-type/roomType.model';
import { databaseConfig } from './database.config';
import { SupportTicket } from 'src/support-ticket/supportTicket.model';
import { TicketResult } from 'src/ticket-result/ticket-result.model';
import { TicketSubject } from 'src/ticket-subject/ticketSubject.model';
import { Review } from 'src/review/review.model';
import { Booking } from 'src/booking/booking.model';
import { Role } from 'src/role/role.model';
import { Amenity } from 'src/amenity/amenity.model';
import { HotelAmenity } from 'src/hotel-amenity/hotel-amenity.mode';
import { TicketStatus } from 'src/ticket-status/ticketStatus.model';
import { Coupon } from 'src/coupon/coupon.model';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
    SequelizeModule.forFeature([
      User,
      Hotel,
      Room,
      Country,
      City,
      ContactInfo,
      RoomType,
      Coupon,
    ]),
    SequelizeModule.forRoot({
      ...databaseConfig[process.env.NODE_ENV || 'development'],
      models: [
        User,
        Hotel,
        Room,
        Country,
        City,
        ContactInfo,
        RoomType,
        SupportTicket,
        TicketResult,
        TicketSubject,
        Review,
        Booking,
        Role,
        Amenity,
        HotelAmenity,
        TicketStatus,
        Coupon,
      ],
    }),
  ],
})
export class DatabaseModule {}
