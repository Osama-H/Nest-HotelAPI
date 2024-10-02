import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Coupon } from './coupon.model';
import { CreateCouponDto } from './dtos/create-coupon.dto';
import { UpdateCouponDto } from './dtos/update-coupon.dto';
import { SearchCouponDto } from './dtos/search-coupon.dto';
import { Op } from 'sequelize';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon) private readonly couponModel: typeof Coupon,
  ) {}

  async findAllCoupons(query: any): Promise<Coupon[]> {
    const {
      code,
      usageType,
      isActive,
      validUntil,
      description,
      sortBy = 'createdAt',
      sortOrder = 'ASC',
    } = query;

    const where: any = {};

    if (code) {
      where.code = { [Op.like]: `${code}%` };
    }

    if (usageType) {
      where.usageType = usageType;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    if (validUntil) {
      where.validUntil = { [Op.lte]: new Date(validUntil) };
    }

    if (description) {
      where.description = { [Op.like]: `%${description}%` };
    }

    const coupons = await this.couponModel.findAll({
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
    });

    return coupons;
  }

  async delete(id: number) {
    const coupon = await this.couponModel.findByPk(id);
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    await coupon.destroy();
  }

  async findOneByCode(code: string) {
    const coupon = await this.couponModel.findOne({ where: { code } });
    return coupon;
  }

  async findById(id: number) {
    const coupon = await this.couponModel.findByPk(id);
    if (!coupon || !coupon.isValid) {
      throw new NotFoundException('Coupon not found, or expired');
    }

    return coupon;
  }

  async create(createCouponDto: CreateCouponDto, adminId: number) {
    const { code, value, usageType, maxUsageCount, validFor, description } =
      createCouponDto;

    const existingCoupon = await this.couponModel.findOne({ where: { code } });
    if (existingCoupon) {
      throw new BadRequestException('Coupon with this code already exists');
    }

    this.validateCouponData(usageType, maxUsageCount, validFor);

    let validUntil: Date | null = null;
    if (usageType === 'time-limited' && validFor) {
      validUntil = this.calculateValidUntil(validFor);
    }

    const newCoupon = await this.couponModel.create({
      code,
      value,
      usageType,
      maxUsageCount: usageType === 'static' ? maxUsageCount : null,
      validUntil,
      description,
      isActive: true,
      adminId,
    });

    return newCoupon;
  }

  private validateCouponData(
    usageType: 'static' | 'time-limited',
    maxUsageCount: number | null,
    validFor: number | null,
  ) {
    if (usageType === 'static') {
      if (maxUsageCount == null) {
        throw new BadRequestException(
          'maxUsageCount is required for static usage type',
        );
      }
      if (validFor != null) {
        throw new BadRequestException(
          'validFor should not be provided for static usage type',
        );
      }
    } else if (usageType === 'time-limited') {
      if (validFor == null) {
        throw new BadRequestException(
          'validFor is required for time-limited usage type',
        );
      }
      if (maxUsageCount != null) {
        throw new BadRequestException(
          'maxUsageCount should not be provided for time-limited usage type',
        );
      }
    } else {
      throw new BadRequestException('Invalid usage type');
    }
  }

  private calculateValidUntil(validFor: number): Date {
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validFor);
    return validUntil;
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    const {
      code,
      value,
      usageType,
      maxUsageCount,
      validFor,
      description,
      isActive,
    } = updateCouponDto;

    const coupon = await this.couponModel.findByPk(id);
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    const newUsageType = usageType ?? coupon.usageType;

    this.validateCouponData(
      newUsageType,
      maxUsageCount ?? coupon.maxUsageCount,
      validFor ?? null,
    );

    let validUntil: Date | null = coupon.validUntil;
    if (newUsageType === 'time-limited') {
      if (validFor) {
        validUntil = this.calculateValidUntil(validFor);
      }
    } else {
      validUntil = null;
    }

    await coupon.update({
      code: code ?? coupon.code,
      value: value ?? coupon.value,
      usageType: newUsageType,
      maxUsageCount: maxUsageCount ?? coupon.maxUsageCount,
      validUntil,
      description: description ?? coupon.description,
      isActive: isActive ?? coupon.isActive,
    });

    return coupon;
  }
}
