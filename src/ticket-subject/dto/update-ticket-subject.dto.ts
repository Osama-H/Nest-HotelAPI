import { IsString, IsOptional } from 'class-validator';

export class UpdateTicketSubjectDto {
  @IsOptional()
  @IsString()
  name: string;
}
