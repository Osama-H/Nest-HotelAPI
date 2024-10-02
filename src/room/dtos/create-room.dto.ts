import { IsString, IsNumber, IsBoolean, Min, Max } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  number: string;

  @IsNumber()
  @Min(1)
  floor: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  @Max(6)
  capacity: number;

  @IsBoolean()
  availability: boolean;

  @IsNumber()
  @Min(1)
  hotelId: number;

  @IsNumber()
  @Min(1)
  roomTypeId: number;
}
