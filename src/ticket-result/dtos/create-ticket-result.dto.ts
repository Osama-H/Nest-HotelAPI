import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTicketResultDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  ticketId: number;
}
