import { IsNumber, IsString } from 'class-validator';
import { Column } from 'sequelize-typescript';

export class CreateCityDto {
  @IsString()
  @Column
  name: string;

  @IsNumber()
  @Column
  countryId: number;
}
