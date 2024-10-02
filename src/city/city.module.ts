import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { City } from './city.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { CountryModule } from 'src/country/country.module';

@Module({
  imports: [SequelizeModule.forFeature([City]), CountryModule],
  providers: [CityService],
  controllers: [CityController],
})
export class CityModule {}
