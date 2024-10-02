import { Module } from '@nestjs/common';
import { TicketSubjectService } from './ticket-subject.service';
import { TicketSubjectController } from './ticket-subject.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TicketSubject } from './ticketSubject.model';


@Module({
  imports: [SequelizeModule.forFeature([TicketSubject])],
  providers: [TicketSubjectService],
  controllers: [TicketSubjectController],
  exports: [TicketSubjectService],
})
export class TicketSubjectModule {}
