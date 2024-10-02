import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteTicketResultDto {
  @IsNotEmpty()
  @IsNumber()
  ticketId: number;
}
