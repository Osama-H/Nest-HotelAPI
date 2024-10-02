import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Column } from 'sequelize-typescript';

export class UpdateCityDto {
  @IsOptional()
  @IsString()
  @Column
  name: string;

  @IsOptional()
  @IsNumber()
  @Column
  countryId: number;
}
