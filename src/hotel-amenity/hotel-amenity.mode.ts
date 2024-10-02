import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Amenity } from 'src/amenity/amenity.model';
import { Hotel } from 'src/hotel/models/hotel.model';

@Table
export class HotelAmenity extends Model {
  @ForeignKey(() => Hotel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  hotelId: number;

  @ForeignKey(() => Amenity)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  amenityId: number;
}
