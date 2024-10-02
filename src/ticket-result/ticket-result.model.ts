import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { SupportTicket } from 'src/support-ticket/supportTicket.model';
import { TicketSubject } from 'src/ticket-subject/ticketSubject.model';
import { User } from 'src/user/user.model';

@Table
export class TicketResult extends Model {
  @Column
  description: string;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  adminId: number;

  @ForeignKey(() => SupportTicket)
  @Column({ allowNull: false })
  ticketId: number;
}
