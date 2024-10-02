import { IsNumber, IsString, IsOptional } from 'class-validator';

export class SearchSupportTicketDto {
  // TODO: This is all must be an number but I got an erros so I convert it to String .. Fix That
  @IsOptional()
  @IsString()
  statusId: string;

  @IsOptional()
  @IsString()
  subjectId: string;

  @IsOptional()
  @IsString()
  userId: string;
}
