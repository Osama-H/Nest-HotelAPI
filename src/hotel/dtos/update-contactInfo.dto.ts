import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateContactInfo {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  fax: string;
}
