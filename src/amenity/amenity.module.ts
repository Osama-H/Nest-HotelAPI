import { Module } from '@nestjs/common';
import { AmenityController } from './amenity.controller';
import { AmenityService } from './amenity.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Amenity } from './amenity.model';

@Module({
  imports: [SequelizeModule.forFeature([Amenity])],
  controllers: [AmenityController],
  providers: [AmenityService],
  exports: [AmenityService],
})
export class AmenityModule {}
