import { IsString } from 'class-validator';
import { Column } from 'sequelize-typescript';

export class CreateRoleDto {
  @IsString()
  @Column
  name: string;
}
