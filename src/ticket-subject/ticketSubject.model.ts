import { Table, Column, Model, HasMany, Index } from 'sequelize-typescript';
import { SupportTicket } from 'src/support-ticket/supportTicket.model';

@Table
export class TicketSubject extends Model {
  @Index
  @Column
  name: string;

  @HasMany(() => SupportTicket)
  supportTickets: SupportTicket[];
}
