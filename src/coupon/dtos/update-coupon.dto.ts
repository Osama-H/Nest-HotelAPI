import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsDate,
  IsNumberString,
} from 'class-validator';

export class UpdateCouponDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsNumber()
  value?: number;

  @IsOptional()
  @IsEnum(['static', 'time-limited'])
  usageType?: 'static' | 'time-limited';

  @IsOptional()
  @IsNumber()
  maxUsageCount?: number | null;

  @IsOptional()
  @IsNumber()
  validFor?: number | null;

  @IsOptional()
  @IsDate()
  validUntil?: Date | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  description?: string | null;
}
