import { IsString } from 'class-validator';
import { Column } from 'sequelize-typescript';

export class CreateTicketStatusDto {
  @IsString()
  @Column
  name: string;
}
