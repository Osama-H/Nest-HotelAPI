import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  HasOne,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  Index,
} from 'sequelize-typescript';
import { City } from 'src/city/city.model';
import { Country } from 'src/country/country.model';
import { Room } from 'src/room/room.model';
import { ContactInfo } from './contactInfo.model';
import { Review } from 'src/review/review.model';
import { Amenity } from 'src/amenity/amenity.model';
import { HotelAmenity } from 'src/hotel-amenity/hotel-amenity.mode';

@Table({
  paranoid: true,
  timestamps: true,
})
export class Hotel extends Model {
  @Index
  @Column
  name: string;

  // TODO: rename this starts .. 
  @Column({
    type: DataType.FLOAT,
  })
  starts: number;

  @Column
  description: string;

  @Index
  @Column({
    type: DataType.FLOAT,
  })
  latitude: number;

  @Index
  @Column({
    type: DataType.FLOAT,
  })
  longitude: number;

  @HasMany(() => Room)
  rooms: Room[];

  @ForeignKey(() => Country)
  @Column({ allowNull: false })
  countryId: number;

  @BelongsTo(() => Country)
  country: Country;

  @ForeignKey(() => City)
  @Column({ allowNull: false })
  cityId: number;

  @BelongsTo(() => City)
  city: City;

  @HasOne(() => ContactInfo)
  contactInfo: ContactInfo;

  @HasMany(() => Review)
  reviews: Review[];

  @BelongsToMany(() => Amenity, () => HotelAmenity)
  amenities: Amenity[];

  //TODO: make it in the class diagram
  getRoomCount(): number {
    return this.rooms ? this.rooms.length : 0;
  }
}
