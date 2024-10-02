import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Booking } from 'src/booking/booking.model';
import { Hotel } from 'src/hotel/models/hotel.model';
import { User } from 'src/user/user.model';

@Table
export class Review extends Model {
  @Column
  rating: number;

  @Column
  review: string;

  @ForeignKey(() => Hotel)
  @Column({ allowNull: false })
  hotelId: number;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  userId: number;

  @ForeignKey(() => Booking)
  @Column({
    allowNull: false,
  })
  bookingId: number;

  @BelongsTo(() => Booking)
  booking: Booking;
}
