import { IsString, IsNumber, ValidateNested, IsDefined } from 'class-validator';
import { Column, IsArray } from 'sequelize-typescript';
import { Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ContactInfoDto } from './ContactInfo.dto';

export class CreateHotelDto {
  @IsString()
  name: string;

  @IsNumber()
  starts: number;

  @IsString()
  description: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsNumber()
  countryId: number;

  @IsNumber()
  cityId: number;

  // @IsArray()
  amenityIds: number[];

  // @IsNotEmptyObject()
  @IsDefined()
  @Type(() => ContactInfoDto)
  @ValidateNested()
  contactInfo: ContactInfoDto;
}
