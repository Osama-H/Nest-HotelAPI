import {
  IsString,
  IsInt,
  IsNumber,
  IsNotEmpty,
  ValidateNested,
  IsEmail,
  IsDefined,
  IsNotEmptyObject,
  IsOptional,
} from 'class-validator';
import { Column } from 'sequelize-typescript';
import { Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateContactInfo } from './update-contactInfo.dto';

export class UpdateHotelDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  starts: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsOptional()
  @IsNumber()
  countryId: number;

  @IsOptional()
  @IsNumber()
  cityId: number;

  @IsOptional()
  @IsDefined()
  @Type(() => UpdateContactInfo)
  @ValidateNested()
  contactInfo: UpdateContactInfo;
}
