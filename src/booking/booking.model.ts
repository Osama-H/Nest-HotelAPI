import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  HasOne,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Coupon } from 'src/coupon/coupon.model';
import { Review } from 'src/review/review.model';

import { Room } from 'src/room/room.model';
import { User } from 'src/user/user.model';

@Table
export class Booking extends Model {
  @Column
  checkInDate: Date;

  @Column
  checkOutDate: Date;

  @Column
  paymentStatus: string;

  @Column
  totalAmount: number;

  @ForeignKey(() => Room)
  @Column({ allowNull: false })
  roomId: number;

  @BelongsTo(() => Room)
  room: Room;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  userId: number;

  @HasOne(() => Review)
  review: Review;

  @ForeignKey(() => Coupon)
  @Column
  couponId: number;
}
