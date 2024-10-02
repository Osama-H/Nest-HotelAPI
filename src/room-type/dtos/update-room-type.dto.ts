import {
  IsString,
  IsInt,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Column } from 'sequelize-typescript';

export class UpdateRoomTypeDto {
  @IsOptional()
  @IsString()
  @Column
  name: string;

  @IsOptional()
  @IsString()
  @Column
  description: string;
}
