import { Module } from '@nestjs/common';
import { TicketStatusController } from './ticket-status.controller';
import { TicketStatusService } from './ticket-status.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TicketStatus } from './ticketStatus.model';

@Module({
  imports: [SequelizeModule.forFeature([TicketStatus])],
  controllers: [TicketStatusController],
  providers: [TicketStatusService],
  exports: [TicketStatusService],
})
export class TicketStatusModule {}
