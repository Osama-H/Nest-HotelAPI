import { Module } from '@nestjs/common';
import { SupportTicketService } from './support-ticket.service';
import { SupportTicketController } from './support-ticket.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SupportTicket } from './supportTicket.model';
import { TicketSubjectModule } from 'src/ticket-subject/ticket-subject.module';
import { TicketStatusModule } from 'src/ticket-status/ticket-status.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    SequelizeModule.forFeature([SupportTicket]),
    AuthModule,
    UserModule,
    TicketSubjectModule,
    TicketStatusModule,
  ],
  providers: [SupportTicketService],
  controllers: [SupportTicketController],
  exports: [SupportTicketService],
})
export class SupportTicketModule {}
