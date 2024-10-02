import { Transform } from 'class-transformer';
import { IsString, IsInt, IsNumber } from 'class-validator';

export class CreateReviewDto {
  // FIXME: doesn't work at float
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  @IsInt()
  rating: number;

  @IsString()
  review: string;

  @IsInt()
  hotelId: number;

  @IsInt()
  bookingId: number;
}
