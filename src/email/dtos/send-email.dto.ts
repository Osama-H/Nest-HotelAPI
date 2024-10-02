import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsDate,
  IsNumberString,
} from 'class-validator';
import { IsInt } from 'sequelize-typescript';

export class SendEmailDto {
  @IsString()
  subject: string;

  @IsString()
  text: string;

  @IsOptional()
  @IsNumber()
  roleId?: number;
}
