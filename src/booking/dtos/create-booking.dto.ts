import { IsNumber, IsOptional, Matches } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  roomId: number;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'checkInDate must be in the format YYYY-MM-DD',
  })
  checkInDate: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'checkOutDate must be in the format YYYY-MM-DD',
  })
  checkOutDate: string;

  @IsNumber()
  @IsOptional()
  couponId: number;
}
