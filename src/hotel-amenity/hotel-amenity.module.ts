import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HotelAmenity } from './hotel-amenity.mode';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [SequelizeModule.forFeature([HotelAmenity]), DatabaseModule],
  // exports: [SequelizeModule],
})
export class HotelAmenityModule {}
