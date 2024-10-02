import { IsOptional, IsString } from 'class-validator';

export class SearchCountryDto {
  @IsOptional()
  @IsString()
  name: string;
}
