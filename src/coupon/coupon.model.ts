import {
  Table,
  Column,
  Model,
  DataType,
  Index,
  HasMany,
  ForeignKey,
} from 'sequelize-typescript';
import { Booking } from 'src/booking/booking.model';
import { User } from 'src/user/user.model';

@Table
export class Coupon extends Model {
  @Index
  @Column({
    type: DataType.STRING,
  })
  code: string;

  @Column({
    type: DataType.FLOAT,
  })
  value: number;

  @Column({
    type: DataType.ENUM('static', 'time-limited'),
    allowNull: false,
  })
  usageType: 'static' | 'time-limited';

  @Column({
    type: DataType.INTEGER,
  })
  maxUsageCount: number | null; // Applicable for 'static'

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  currentUsageCount: number | null;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  adminId: number;

  @Column({
    type: DataType.DATE,
  })
  validUntil: Date | null; // Applicable for 'time-limited' type

  @Column({
    type: DataType.BOOLEAN,
  })
  isActive: boolean;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @HasMany(() => Booking)
  bookings: Booking[];

  get isValid(): boolean {
    const now = new Date();

    if (!this.isActive) {
      return false;
    }

    if (this.usageType === 'static') {
      if (
        this.maxUsageCount !== null &&
        this.currentUsageCount >= this.maxUsageCount
      ) {
        return false;
      }
    }

    if (this.usageType === 'time-limited') {
      if (this.validUntil && now > this.validUntil) {
        return false;
      }
    }

    return true;
  }
}
