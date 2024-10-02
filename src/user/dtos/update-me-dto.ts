import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsInt,
  IsDate,
  IsUrl,
} from 'class-validator';

export class UpdateMeDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}
