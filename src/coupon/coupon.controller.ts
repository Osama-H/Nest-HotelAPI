import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dtos/create-coupon.dto';
import { UpdateCouponDto } from './dtos/update-coupon.dto';
import { SearchCouponDto } from './dtos/search-coupon.dto';
import { getCurrentUserId } from 'src/decorators/get-current-user-id.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';

// TODO: Uncomment after testing
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  async create(
    @Body() createCouponDto: CreateCouponDto,
    @getCurrentUserId() adminId: number,
  ) {
    return await this.couponService.create(createCouponDto, adminId);
  }

  @Get(':id')
  async getCoupon(@Param('id') id: number) {
    return await this.couponService.findById(id);
  }

  @Get()
  async getAllCoupons(@Query() searchCouponDto: SearchCouponDto) {
    return await this.couponService.findAllCoupons(searchCouponDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.couponService.delete(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    return await this.couponService.update(id, updateCouponDto);
  }
}
