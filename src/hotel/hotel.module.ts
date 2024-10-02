import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { Hotel } from './models/hotel.model';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { ContactInfo } from './models/contactInfo.model';
import { AmenityModule } from 'src/amenity/amenity.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Hotel, ContactInfo]),
    AuthModule,
    UserModule,
    AmenityModule,
  ],
  providers: [HotelService],
  controllers: [HotelController],
  exports: [HotelService],
})
export class HotelModule {}
