import { Module } from '@nestjs/common';
import { TicketResultController } from './ticket-result.controller';
import { TicketResultService } from './ticket-result.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TicketResult } from './ticket-result.model';
import { SupportTicketModule } from 'src/support-ticket/support-ticket.module';
import { TicketStatusModule } from 'src/ticket-status/ticket-status.module';
import { TicketSubjectModule } from 'src/ticket-subject/ticket-subject.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    SequelizeModule.forFeature([TicketResult]),
    AuthModule,
    UserModule,
    SupportTicketModule,
    TicketStatusModule,
    TicketSubjectModule,
  ],
  controllers: [TicketResultController],
  providers: [TicketResultService],
})
export class TicketResultModule {}
