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
} from 'class-validator';

export class SearchRoleDto {
  @IsOptional()
  @IsString()
  name: string;
}
