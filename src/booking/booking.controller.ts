import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { StripeService } from 'src/stripe/stripe.service';
import { Booking } from './booking.model';

import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { getCurrentUserId } from 'src/decorators/get-current-user-id.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('user')
  @Post('create')
  async createBooking(
    @getCurrentUserId() userId: number,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    const createBooking = this.bookingService.create(userId, createBookingDto);
    return createBooking;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('user')
  @Get('myBookings')
  async getMyBookings(@getCurrentUserId() userId: number) {
    const myBookings = this.bookingService.getAllMyBookings(userId);
    return myBookings;
  }
}
