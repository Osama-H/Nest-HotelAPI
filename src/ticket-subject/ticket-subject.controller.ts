import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { TicketSubjectService } from './ticket-subject.service';
import { UpdateTicketSubjectDto } from './dto/update-ticket-subject.dto';
import { CreateTicketSubjectDto } from './dto/create-ticket-subject.dto';
import { SearchTicketSubjectDto } from './dto/search-ticket-subject.dto';

@Controller('ticket-subjects')
export class TicketSubjectController {
  constructor(private readonly ticketSubjectService: TicketSubjectService) {}

  @Get()
  async findAll(@Query() serachTicketSubject: SearchTicketSubjectDto) {
    return this.ticketSubjectService.findAll(serachTicketSubject);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketSubjectService.findById(id);
  }

  // TODO: uncomment this after testing ..
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles('admin')
  @Post()
  async create(@Body() createTicketSubjectDto: CreateTicketSubjectDto) {
    const { name } = createTicketSubjectDto;
    return this.ticketSubjectService.create(name);
  }

  // TODO: uncomment this after testing ..
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles('admin')
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketSubjectDto: UpdateTicketSubjectDto,
  ) {
    return this.ticketSubjectService.update(id, updateTicketSubjectDto);
  }

  // TODO: uncomment this after testing ..
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles('admin')
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.ticketSubjectService.delete(id);
  }
}
