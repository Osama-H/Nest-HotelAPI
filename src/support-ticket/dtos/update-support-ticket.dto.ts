import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateSupportTicketDto {
  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  subjectId: number;
}
