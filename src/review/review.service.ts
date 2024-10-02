import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from './review.model';
import { CreateReviewDto } from './dtos/create-review.dto';
import { HotelService } from 'src/hotel/hotel.service';
import { BookingService } from 'src/booking/booking.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review) private readonly reviewModel: typeof Review,
    private readonly hotelService: HotelService,
    private readonly bookingService: BookingService,
  ) {}

  findByUserAndHotel(userId: number, hotelId: number) {
    return this.reviewModel.findOne({ where: { userId, hotelId } });
  }

  async createReview(userId: number, createReviewDto: CreateReviewDto) {
    const { bookingId, hotelId, rating, review } = createReviewDto;

    const booking = await this.bookingService.findBookingByUserId(
      userId,
      bookingId,
    );

    if (booking.room.hotelId !== hotelId) {
      throw new BadRequestException(
        'The booking is not associated with the provided hotel.',
      );
    }

    const existingReview = await this.reviewModel.findOne({
      where: { bookingId },
    });
    if (existingReview) {
      throw new BadRequestException(
        'A review for this booking already exists.',
      );
    }

    const newReview = await this.reviewModel.create({
      rating,
      review,
      hotelId,
      bookingId,
      userId,
    });
    return newReview;
  }
}
