import { IsOptional, IsString, IsIn, IsBooleanString } from 'class-validator';

export class SearchCouponDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsIn(['static', 'time-limited'])
  usageType?: 'static' | 'time-limited';

  @IsOptional()
  @IsBooleanString()
  isActive?: string;

  @IsOptional()
  @IsString()
  validUntil?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}
