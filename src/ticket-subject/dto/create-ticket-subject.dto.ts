import {
  IsString,
  IsInt,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { Column } from 'sequelize-typescript';

export class CreateTicketSubjectDto {
  @IsString()
  @Column
  name: string;
}
