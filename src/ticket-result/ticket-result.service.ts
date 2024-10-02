import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

import { TicketResult } from './ticket-result.model';
import { SupportTicketService } from 'src/support-ticket/support-ticket.service';
import { TicketSubjectService } from 'src/ticket-subject/ticket-subject.service';
import { CreateTicketResultDto } from './dtos/create-ticket-result.dto';
import { UpdateTicketResultDto } from './dtos/update-ticket-result.dto';
import { TicketStatusService } from 'src/ticket-status/ticket-status.service';
import { DeleteTicketResultDto } from './dtos/delete-ticket-result.dto';

@Injectable()
export class TicketResultService {
  constructor(
    @InjectModel(TicketResult)
    private readonly ticketResultModel: typeof TicketResult,
    private readonly sequelize: Sequelize,
    private readonly supportTicketService: SupportTicketService,
    private readonly ticketStatusService: TicketStatusService,
    private readonly ticketSubjectService: TicketSubjectService,
  ) {}

  async create(createTicketResultDto: CreateTicketResultDto, adminId: number) {
    const { ticketId, description } = createTicketResultDto;

    return this.sequelize.transaction(async (transaction) => {
      const supportTicket = await this.supportTicketService.findById(ticketId);
      if (!supportTicket) {
        throw new NotFoundException('SUPPORT_TICKET_NOT_FOUND');
      }

      const ticketStatus = await this.ticketStatusService.findById(
        supportTicket.statusId,
      );
      if (ticketStatus.name !== 'OPEN') {
        throw new BadRequestException('CANNOT_ADD_RESULT_TO_CLOSED_TICKET');
      }

      const ticketResult = await this.ticketResultModel.create(
        {
          description: description.trim(),
          adminId,
          ticketId,
        },
        { transaction },
      );

      const closedStatus = await this.ticketStatusService.findByName('CLOSED');
      if (!closedStatus) {
        throw new NotFoundException('TICKET_STATUS_CLOSED_NOT_FOUND');
      }

      supportTicket.statusId = closedStatus.id;
      await supportTicket.save({ transaction });

      return ticketResult;
    });
  }

  async findByTicketId(ticketId: number) {
    const ticketResult = await this.ticketResultModel.findOne({
      where: { ticketId },
      include: [{ all: true }],
    });

    if (!ticketResult) {
      throw new NotFoundException('TICKET_RESULT_NOT_FOUND');
    }

    return ticketResult;
  }

  async update(
    ticketId: number,
    updateTicketResultDto: UpdateTicketResultDto,
    adminId: number,
  ) {
    const ticketResult = await this.ticketResultModel.findOne({
      where: { ticketId },
    });

    if (!ticketResult) {
      throw new NotFoundException('TICKET_RESULT_NOT_FOUND');
    }

    if (ticketResult.adminId !== adminId) {
      throw new UnauthorizedException('ONLY_ADMIN_CAN_UPDATE_RESULT');
    }

    if (updateTicketResultDto.description) {
      ticketResult.description = updateTicketResultDto.description.trim();
    }

    await ticketResult.save();

    return ticketResult;
  }

  async delete(deleteTicketResultDto: DeleteTicketResultDto, adminId: number) {
    const { ticketId } = deleteTicketResultDto;
    return this.sequelize.transaction(async (transaction) => {
      const ticketResult = await this.ticketResultModel.findOne({
        where: { ticketId },
      });

      if (!ticketResult) {
        throw new NotFoundException('TICKET_RESULT_NOT_FOUND');
      }

      if (ticketResult.adminId !== adminId) {
        throw new UnauthorizedException(
          'ONLY_THE_ADMIN_WHO_CREATED_THIS_TICKET_RESULT_CAN_DELETE_IT',
        );
      }

      const supportTicket = await this.supportTicketService.findById(ticketId);
      if (!supportTicket) {
        throw new NotFoundException('SUPPORT_TICKET_NOT_FOUND');
      }

      const openStatus = await this.ticketStatusService.findByName('OPEN');
      if (!openStatus) {
        throw new NotFoundException('TICKET_STATUS_OPEN_NOT_FOUND');
      }

      await supportTicket.update({ statusId: openStatus.id }, { transaction });

      await ticketResult.destroy({ transaction });

      return { message: 'TICKET_RESULT_DELETED_AND_STATUS_UPDATED_TO_OPEN' };
    });
  }
}
