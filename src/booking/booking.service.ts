import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Booking } from './booking.model';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { StripeService } from 'src/stripe/stripe.service';
import { RoomService } from 'src/room/room.service';
import { Room } from 'src/room/room.model';
import { calculateNumberOfDays } from 'src/utils/getNumOfDays';
import { CouponService } from 'src/coupon/coupon.service';
import { Hotel } from 'src/hotel/models/hotel.model';
import { EmailService } from 'src/email/email.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking) private readonly bookingModel: typeof Booking,
    private readonly roomService: RoomService,
    private readonly couponService: CouponService,
    private readonly userService: UserService,
    private emailService: EmailService,
    private readonly stripeService: StripeService,
  ) {}

  async create(
    userId: number,
    createBookingDto: CreateBookingDto,
  ): Promise<Booking> {
    const { checkInDate, checkOutDate, roomId, couponId } = createBookingDto;

    const room = await this.roomService.findById(roomId);

    if (!room) {
      throw new BadRequestException('Room not found');
    }

    if (!room.isAvailable(new Date(checkInDate), new Date(checkOutDate))) {
      throw new BadRequestException(
        'Room is not available for the selected dates',
      );
    }

    const diffInDays = calculateNumberOfDays(checkInDate, checkOutDate);
    let totalPrice = diffInDays * room.price;

    if (couponId) {
      const coupon = await this.couponService.findById(couponId);

      const discount = (coupon.value / 100) * totalPrice;
      totalPrice -= discount;

      if (coupon.usageType === 'static') {
        coupon.currentUsageCount += 1;
        await coupon.save();
      }
    }

    const charge = await this.stripeService.createCharge(
      totalPrice,
      'tok_visa',
      'usd',
    );

    const booking = new Booking({
      userId,
      roomId: room.id,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      paymentStatus: charge.status,
      totalAmount: charge.amount,
    });

    const findUser = await this.userService.findOne(userId);

    const bookingDetails = {
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      room,
      totalAmount: booking.totalAmount,
      paymentStatus: booking.paymentStatus,
    };

    await this.emailService.sendBookingConfirmationEmail(
      findUser.email,
      bookingDetails,
    );

    return booking.save();
  }

  async findBookingByUserId(userId: number, bookingId: number) {
    const booking = await this.bookingModel.findOne({
      where: { id: bookingId, userId },
      include: [{ model: Room, include: ['hotel'] }],
    });
    if (!booking) {
      throw new BadRequestException('Booking not found');
    }
    return booking;
  }

  async getAllMyBookings(userId: number) {
    const bookings = await this.bookingModel.findAll({
      where: { userId },
      include: [
        {
          model: Room,
          include: [
            {
              model: Hotel,
              attributes: ['name'],
            },
          ],
        },
      ],
    });

    return bookings;
  }
}
