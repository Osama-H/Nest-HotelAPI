import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TicketStatus } from './ticketStatus.model';
import { Op } from 'sequelize';
import { UpdateTicketStatusDto } from './dtos/update-ticket-status.dto';
import { SearchTicketStatusDto } from './dtos/search-ticket-status.dto';

@Injectable()
export class TicketStatusService {
  constructor(
    @InjectModel(TicketStatus)
    private readonly ticketStatusModel: typeof TicketStatus,
  ) {}

  async findAll(searchTicketStatusDto: SearchTicketStatusDto) {
    const { name } = searchTicketStatusDto;

    const where: any = {};
    if (name) {
      where.name = { [Op.iLike]: `${name}%` };
    }

    const ticketStatuses = await this.ticketStatusModel.findAll({ where });

    if (!ticketStatuses.length) {
      throw new NotFoundException('NO_TICKET_STATUSES_FOUND');
    }

    return ticketStatuses;
  }

  async findById(id: number) {
    const ticketStatus = await this.ticketStatusModel.findByPk(id);
    if (!ticketStatus) {
      throw new NotFoundException('TICKET_STATUS_NOT_FOUND');
    }
    return ticketStatus;
  }

  async findByName(name: string) {
    const ticketStatus = await this.ticketStatusModel.findOne({
      where: { name: name.toUpperCase() },
    });
    return ticketStatus;
  }

  async create(name: string) {
    const foundTicketStatus = await this.findByName(name);
    if (foundTicketStatus) {
      throw new ConflictException('TICKET_STATUS_ALREADY_EXISTS');
    }
    const ticketStatus = await this.ticketStatusModel.create({
      name: name.toUpperCase(),
    });
    return ticketStatus;
  }

  async update(id: number, updateTicketStatusDto: UpdateTicketStatusDto) {
    const ticketStatus = await this.findById(id);
    if (!ticketStatus) {
      throw new NotFoundException('TICKET_STATUS_NOT_FOUND');
    }

    const updatedTicketStatus = await this.ticketStatusModel.update(
      updateTicketStatusDto,
      {
        where: { id },
        returning: true,
      },
    );
    return updatedTicketStatus;
  }

  async delete(id: number) {
    const ticketStatus = await this.findById(id);
    if (!ticketStatus) {
      throw new NotFoundException('TICKET_STATUS_NOT_FOUND');
    }
    await this.ticketStatusModel.destroy({ where: { id } });
    return 'Ticket Status Deleted Successfully';
  }
}
