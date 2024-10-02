import { Transform } from 'class-transformer';
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
  isNumber,
} from 'class-validator';

export class SearchHotelDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  @IsNumber()
  minStarts: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  @IsNumber()
  maxStarts: number;

  // FIXME: should be number
  @IsOptional()
  @IsString()
  page: number;

  // FIXME: should be number
  @IsOptional()
  @IsString()
  limit: number;
}
