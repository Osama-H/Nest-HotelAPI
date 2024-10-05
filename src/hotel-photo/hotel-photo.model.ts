import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Hotel } from '../hotel/models/hotel.model';

@Table
export class HotelPhoto extends Model {
  @Column
  url: string;

  @Column({
    defaultValue: false,
  })
  isPrimary: boolean;

  @ForeignKey(() => Hotel)
  @Column
  hotelId: number;

  @BelongsTo(() => Hotel)
  hotel: Hotel;
}
