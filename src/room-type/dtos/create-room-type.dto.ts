import {
  IsString,
  IsInt,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { Column } from 'sequelize-typescript';

export class CreateRoomTypeDto {
  @IsString()
  @Column
  name: string;

  @IsString()
  @Column
  description: string;
}
