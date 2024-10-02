import { IsOptional, IsString } from 'class-validator';

export class SearchTicketSubjectDto {
  @IsOptional()
  @IsString()
  name: string;
}
