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

export class SearchUserDto {
  @IsOptional()
  @IsString()
  name: string;

  // FIXME: should be number
  @IsOptional()
  @IsNumber()
  page: number;

  // FIXME: should be number
  @IsOptional()
  @IsNumber()
  limit: number;
}
