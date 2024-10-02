import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  Index,
} from 'sequelize-typescript';
import { City } from 'src/city/city.model';
import { Hotel } from 'src/hotel/models/hotel.model';

@Table
export class Country extends Model {
  @Index
  @Column({
    type: DataType.STRING,
    set(value: string) {
      this.setDataValue('name', value.toLowerCase());
    },
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  code: string;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @HasMany(() => Hotel)
  hotels: Hotel[];

  @HasMany(() => City)
  cities: City[];
}
