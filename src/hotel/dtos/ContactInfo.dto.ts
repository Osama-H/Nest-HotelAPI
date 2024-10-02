import { IsString, IsEmail } from 'class-validator';

export class ContactInfoDto {
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  fax: string;
}
