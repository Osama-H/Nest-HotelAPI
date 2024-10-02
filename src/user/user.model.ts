import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
  Index,
} from 'sequelize-typescript';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { SupportTicket } from 'src/support-ticket/supportTicket.model';
import { TicketResult } from 'src/ticket-result/ticket-result.model';
import { Review } from 'src/review/review.model';
import { Booking } from 'src/booking/booking.model';
import { Role } from 'src/role/role.model';
import { Coupon } from 'src/coupon/coupon.model';


@Table
export class User extends Model {
  @Index
  @Column
  username: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column
  photoUrl: string;

  @HasMany(() => SupportTicket)
  supportTickets: SupportTicket[];

  @HasMany(() => TicketResult)
  ticketResults: TicketResult[];

  @HasMany(() => Coupon)
  coupons: Coupon[];

  @HasMany(() => Review)
  reviews: Review[];

  @HasMany(() => Booking)
  bookings: Booking[];

  @ForeignKey(() => Role)
  @Column({ allowNull: false })
  roleId: number;

  @BelongsTo(() => Role)
  role: Role;

  @Column
  verificationCode: string;

  @Column(DataType.DATE)
  verificationCodeExpires: Date;

  @Column
  isVerified: boolean;

  @Column
  passwordResetToken: string;

  @Column(DataType.DATE)
  passwordResetExpires: Date;

  async setPasswordResetToken() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await this.save();

    return resetToken;
  }

  async comparePassword(candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
  }
}
