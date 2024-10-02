import { IsString, IsOptional } from 'class-validator';
import { Column } from 'sequelize-typescript';

export class UpdateTicketStatusDto {
  @IsOptional()
  @IsString()
  @Column
  name: string;
}
