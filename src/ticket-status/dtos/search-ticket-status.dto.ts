import { IsString, IsOptional } from 'class-validator';
import { Column } from 'sequelize-typescript';

export class SearchTicketStatusDto {
  @IsOptional()
  @IsString()
  @Column
  name: string;
}
