import {
  Table,
  Column,
  Model,
  ForeignKey,
  HasOne,
  BelongsTo,
} from 'sequelize-typescript';
import { TicketResult } from 'src/ticket-result/ticket-result.model';
import { TicketStatus } from 'src/ticket-status/ticketStatus.model';
import { TicketSubject } from 'src/ticket-subject/ticketSubject.model';
import { User } from 'src/user/user.model';

@Table
export class SupportTicket extends Model {
  @Column
  description: string;

  @ForeignKey(() => User)
  userId: number;

  @ForeignKey(() => TicketSubject)
  @Column
  subjectId: number;

  @BelongsTo(() => TicketSubject)
  subject: TicketSubject;

  @HasOne(() => TicketResult)
  ticketResult: TicketResult;

  @ForeignKey(() => TicketStatus)
  @Column
  statusId: number;

  @BelongsTo(() => TicketStatus)
  status: TicketStatus;
}
