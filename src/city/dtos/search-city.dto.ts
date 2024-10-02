import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class SearchCityDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  countryId: number;
}
