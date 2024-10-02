import {
  Table,
  Column,
  Model,
  ForeignKey,
  HasOne,
  HasMany,
  BelongsToMany,
  Index,
} from 'sequelize-typescript';
import { HotelAmenity } from 'src/hotel-amenity/hotel-amenity.mode';
import { Hotel } from 'src/hotel/models/hotel.model';

@Table
export class Amenity extends Model {
  @Index
  @Column
  name: string;

  @Column
  description: string;

  @BelongsToMany(() => Hotel, () => HotelAmenity)
  hotels: Hotel[];
}
