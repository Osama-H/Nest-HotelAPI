import { Sequelize } from 'sequelize-typescript';

// import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';
import { User } from 'src/user/user.model';
import { Hotel } from 'src/hotel/models/hotel.model';
import { Amenity } from 'src/amenity/amenity.model';
import { City } from 'src/city/city.model';
import { Country } from 'src/country/country.model';
import { ContactInfo } from 'src/hotel/models/contactInfo.model';
import { Review } from 'src/review/review.model';
import { RoomType } from 'src/room-type/roomType.model';
import { Room } from 'src/room/room.model';
import { SupportTicket } from 'src/support-ticket/supportTicket.model';
import { TicketResult } from 'src/ticket-result/ticket-result.model';
import { TicketSubject } from 'src/ticket-subject/ticketSubject.model';
import { Booking } from 'src/booking/booking.model';
import { Role } from 'src/role/role.model';
import { HotelAmenity } from 'src/hotel-amenity/hotel-amenity.mode';
import { HotelPhoto } from 'src/hotel-photo/hotel-photo.model';
// import { User } from '../../modules/users/user.entity';
// import { Post } from '../../modules/posts/post.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case 'DEVELOPMENT':
          config = databaseConfig.development;
          break;
        case 'TEST':
          config = databaseConfig.test;
          break;
        case 'PRODUCTION':
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config);
      sequelize.addModels([
        User,
        Hotel,
        Room,
        Country,
        City,
        ContactInfo,
        RoomType,
        Review,
        Amenity,
        SupportTicket,
        TicketResult,
        TicketSubject,
        Booking,
        Role,
        HotelAmenity,
        HotelPhoto
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
