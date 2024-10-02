import {
  IsString,
  IsInt,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Column } from 'sequelize-typescript';

export class UpdateAmenityDto {
  @IsOptional()
  @IsString()
  @Column
  name: string;

  @IsOptional()
  @IsString()
  @Column
  description: string;
}
