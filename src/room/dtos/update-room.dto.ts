import {
  IsString,
  IsNumber,
  ValidateNested,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  number: string;

  @IsOptional()
  @IsNumber()
  floor: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity: number;

  @IsOptional()
  @IsBoolean()
  availability: boolean;

  @IsOptional()
  @IsNumber()
  hotelId: number;

  @IsOptional()
  @IsNumber()
  roomTypeId: number;
}
