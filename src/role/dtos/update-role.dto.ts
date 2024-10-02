import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Column } from 'sequelize-typescript';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  @Column
  name: string;
}
