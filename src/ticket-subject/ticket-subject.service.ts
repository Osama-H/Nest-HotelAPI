import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TicketSubject } from './ticketSubject.model';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { UpdateTicketSubjectDto } from './dto/update-ticket-subject.dto';
import { SearchTicketSubjectDto } from './dto/search-ticket-subject.dto';
import { SupportTicketService } from 'src/support-ticket/support-ticket.service';

@Injectable()
export class TicketSubjectService {
  constructor(
    @InjectModel(TicketSubject)
    private readonly ticketSubjectModel: typeof TicketSubject,
  ) {}

  async findAll(searchTicketSubjectDto: SearchTicketSubjectDto) {
    const { name } = searchTicketSubjectDto;

    const where: any = {};
    if (name) {
      where.name = { [Op.iLike]: `${name}%` };
    }

    const ticketSubjects = await this.ticketSubjectModel.findAll({ where });

    if (!ticketSubjects.length) {
      throw new NotFoundException('NO_TICKET_SUBJECTS_FOUND');
    }

    return ticketSubjects;
  }
  async findById(id: number) {
    const ticketSubject = await this.ticketSubjectModel.findByPk(id);
    if (!ticketSubject) {
      throw new NotFoundException('TICKET_SUBJECT_NOT_FOUND');
    }
    return ticketSubject;
  }

  async findByName(name: string) {
    const ticketSubject = await this.ticketSubjectModel.findOne({
      where: { name: name.toLowerCase() },
    });
    return ticketSubject;
  }

  async create(name: string) {
    const foundTicketSubject = await this.findByName(name);
    if (foundTicketSubject) {
      throw new ConflictException('TICKET_SUBJECT_ALREADY_EXISTS');
    }
    const ticketSubject = await this.ticketSubjectModel.create({
      name: name.toLowerCase(),
    });
    return ticketSubject;
  }

  async update(id: number, updateTicketSubjectDto: UpdateTicketSubjectDto) {
    const ticketSubject = await this.findById(id);
    if (!ticketSubject) {
      throw new NotFoundException('TICKET_SUBJECT_NOT_FOUND');
    }

    const updatedTicketSubject = await this.ticketSubjectModel.update(
      updateTicketSubjectDto,
      {
        where: { id },
        returning: true,
      },
    );
    return updatedTicketSubject;
  }

  async delete(id: number) {
    const ticketSubject = await this.findById(id);
    if (!ticketSubject) {
      throw new NotFoundException('TICKET_SUBJECT_NOT_FOUND');
    }
    await this.ticketSubjectModel.destroy({ where: { id } });
    return 'Ticket Subject Deleted Successfully';
  }
}
