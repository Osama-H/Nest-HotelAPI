import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Country } from './country.model';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [SequelizeModule.forFeature([Country])],
  providers: [CountryService],
  controllers: [CountryController],
  exports: [CountryService],
})
export class CountryModule {}
