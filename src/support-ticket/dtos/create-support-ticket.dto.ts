import { IsString, IsNumber } from 'class-validator';
import { Column } from 'sequelize-typescript';
import { Min } from 'class-validator';

export class SupportTiecketDto {
  @IsString()
  @Column
  description: string;

  @IsNumber()
  @Column
  @Min(1)
  subjectId: number;
}
