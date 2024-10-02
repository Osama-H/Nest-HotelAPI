import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
  Index,
} from 'sequelize-typescript';
import { Country } from 'src/country/country.model';
import { Hotel } from 'src/hotel/models/hotel.model';

@Table({
  indexes: [
    {
      name: 'idx_city_name_country',
      unique: true,
      fields: ['name', 'countryId'],
    },
  ],
})
export class City extends Model {
  @Index('idx_city_name')
  @Column({
    type: DataType.STRING,
    set(value: string) {
      this.setDataValue('name', value.toLowerCase());
    },
  })
  name: string;

  @ForeignKey(() => Country)
  @Index('idx_city_countryId')
  @Column({ allowNull: false })
  countryId: number;

  @HasMany(() => Hotel)
  hotels: Hotel[];
}
