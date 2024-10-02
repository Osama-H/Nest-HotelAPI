import {
  Table,
  Column,
  Model,
  ForeignKey,
  AllowNull,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
import { Booking } from 'src/booking/booking.model';
import { Hotel } from 'src/hotel/models/hotel.model';
import { RoomType } from 'src/room-type/roomType.model';

@Table
export class Room extends Model {
  @Column
  number: string;

  @Column
  floor: number;

  @Column
  price: number;

  @Column
  capacity: number;

  @Column
  availability: boolean;

  @ForeignKey(() => RoomType)
  @Column({ allowNull: false })
  roomTypeId: number;

  @ForeignKey(() => Hotel)
  @Column({ allowNull: false })
  hotelId: number;

  @BelongsTo(() => Hotel)
  hotel: Hotel;

  @HasMany(() => Booking)
  bookings: Booking[];

  @BelongsTo(() => RoomType)
  roomType: RoomType;

  isAvailable(checkInDate: Date, checkOutDate: Date): boolean {
    for (const booking of this.bookings) {
      if (
        (checkInDate >= booking.checkInDate &&
          checkInDate < booking.checkOutDate) ||
        (checkOutDate > booking.checkInDate &&
          checkOutDate <= booking.checkOutDate) ||
        (checkInDate <= booking.checkInDate &&
          checkOutDate >= booking.checkOutDate)
      ) {
        return false;
      }
    }
    return true;
  }
}
