import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { getCurrentUserId } from 'src/decorators/get-current-user-id.decorator';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // TODO: uncomment this after testing ..
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles('user')
  @Post()
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @getCurrentUserId() userId: number,
  ) {
    return await this.reviewService.createReview(userId, createReviewDto);
  }
}
