import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Coupon } from './coupon.model';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [SequelizeModule.forFeature([Coupon]), AuthModule, UserModule],
  providers: [CouponService],
  controllers: [CouponController],
  exports: [CouponService],
})
export class CouponModule {}
