import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsIn,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsIn(['static', 'time-limited'])
  @IsNotEmpty()
  usageType: 'static' | 'time-limited';

  @ValidateIf((o) => o.usageType === 'static')
  @IsNumber()
  @IsNotEmpty()
  maxUsageCount: number;

  @ValidateIf((o) => o.usageType === 'time-limited')
  @IsNumber()
  @IsNotEmpty()
  validFor: number;

  @IsOptional()
  @IsString()
  description: string;
}
