import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTicketResultDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  statusId?: number;
}
