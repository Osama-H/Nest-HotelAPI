import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SupportTicket } from './supportTicket.model';
import { TicketSubjectService } from 'src/ticket-subject/ticket-subject.service';
import { TicketStatusService } from 'src/ticket-status/ticket-status.service';
import { Op } from 'sequelize';
import { SupportTiecketDto } from './dtos/create-support-ticket.dto';
import { SearchSupportTicketDto } from './dtos/search-support-ticket.dto';
import { UpdateSupportTicketDto } from './dtos/update-support-ticket.dto';
import { TicketResult } from 'src/ticket-result/ticket-result.model';
import { TicketStatus } from 'src/ticket-status/ticketStatus.model';

@Injectable()
export class SupportTicketService {
  constructor(
    @InjectModel(SupportTicket)
    private readonly supportTicketModel: typeof SupportTicket,
    private readonly ticketSubjectService: TicketSubjectService,
    private readonly ticketStatusService: TicketStatusService,
  ) {}

  async create(supportTicketDto: SupportTiecketDto, userId: number) {
    const { description, subjectId } = supportTicketDto;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const ticketsTodayCount = await this.supportTicketModel.count({
      where: {
        userId,
        createdAt: {
          [Op.between]: [startOfToday, endOfToday],
        },
      },
    });

    // TODO: Uncomment this in production
    // if (ticketsTodayCount >= 2) {
    //   throw new BadRequestException('USER_HAS_REACHED_DAILY_TICKET_LIMIT');
    // }

    const ticketSubject = await this.ticketSubjectService.findById(subjectId);
    if (!ticketSubject) {
      throw new NotFoundException('TICKET_SUBJECT_NOT_FOUND');
    }

    const ticketStatus = await this.ticketStatusService.findByName('OPEN');
    if (!ticketStatus) {
      throw new NotFoundException('TICKET_STATUS_NOT_FOUND');
    }

    const supportTicket = await this.supportTicketModel.create({
      description: description.trim(),
      statusId: ticketStatus.id,
      subjectId,
      userId: userId,
    });
    return supportTicket;
  }

  // TODO: I remove userId from here ..
  async findByIdForLoggedIn(id: number, userId: number, isAdmin: boolean) {
    const supportTicket = await this.supportTicketModel.findOne({
      where: { id },
      include: [
        { model: TicketResult },
        { model: TicketStatus, attributes: ['name'] },
      ],
    });
    if (!supportTicket) {
      throw new NotFoundException('SUPPORT_TICKET_NOT_FOUND');
    }

    if (!isAdmin) {
      if (supportTicket.userId !== userId) {
        throw new UnauthorizedException(
          'CANNOT_VIEW_OTHER_USERS_SUPPORT_TICKET',
        );
      }
    }

    return supportTicket;
  }

  async findById(id: number) {
    const supportTicket = await this.supportTicketModel.findOne({
      where: { id },
    });
    if (!supportTicket) {
      throw new NotFoundException('SUPPORT_TICKET_NOT_FOUND');
    }

    return supportTicket;
  }

  async findAll(
    searchSupportTicketDto: SearchSupportTicketDto,
    userId: number,
    isAdmin: boolean,
  ) {
    const { subjectId, statusId } = searchSupportTicketDto;

    const whereClause: any = {};

    if (subjectId) {
      whereClause['subjectId'] = subjectId;
    }
    if (statusId) {
      whereClause['statusId'] = statusId;
    }

    // If the user is not an admin, override the userId to the logged-in user's ID
    if (!isAdmin) {
      whereClause['userId'] = userId;
    } else if (isAdmin && searchSupportTicketDto.userId) {
      whereClause['userId'] = searchSupportTicketDto.userId;
    }

    const supportTickets = await this.supportTicketModel.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });
    return supportTickets;
  }

  async update(
    id: number,
    supportTicketDto: UpdateSupportTicketDto,
    userId: number,
  ) {
    const supportTicket = await this.supportTicketModel.findOne({
      where: { id, userId },
    });

    if (!supportTicket) {
      throw new NotFoundException('SUPPORT_TICKET_NOT_FOUND');
    }

    const ticketStatus = await this.ticketStatusService.findById(
      supportTicket.statusId,
    );
    if (ticketStatus.name !== 'OPEN') {
      throw new BadRequestException('CANNOT_UPDATE_CLOSED_OR_PENED_TICKET');
    }

    if (supportTicketDto.subjectId) {
      const ticketSubject = await this.ticketSubjectService.findById(
        supportTicketDto.subjectId,
      );
      if (!ticketSubject) {
        throw new NotFoundException('TICKET_SUBJECT_NOT_FOUND');
      }
      supportTicket.subjectId = supportTicketDto.subjectId;
    }

    if (supportTicketDto.description) {
      supportTicket.description = supportTicketDto.description;
    }

    await supportTicket.save();

    return supportTicket;
  }

  async delete(id: number, userId: number, isAdmin: boolean) {
    const supportTicket = await this.supportTicketModel.findOne({
      where: { id },
    });

    if (!supportTicket) {
      throw new NotFoundException('SUPPORT_TICKET_NOT_FOUND');
    }

    if (isAdmin) {
      await supportTicket.destroy();
      return { message: 'SUPPORT_TICKET_DELETED' };
    } else {
      if (supportTicket.userId !== userId) {
        throw new UnauthorizedException(
          'CANNOT_DELETE_OTHER_USERS_SUPPORT_TICKET',
        );
      }

      const ticketStatus = await this.ticketStatusService.findById(
        supportTicket.statusId,
      );
      if (ticketStatus.name !== 'OPEN') {
        throw new BadRequestException('CANNOT_DELETE_CLOSED_TICKET');
      }

      await supportTicket.destroy();

      return { message: 'SUPPORT_TICKET_DELETED' };
    }
  }
}
