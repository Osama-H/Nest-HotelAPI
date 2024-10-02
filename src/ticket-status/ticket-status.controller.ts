import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { TicketStatusService } from './ticket-status.service';
import { UpdateTicketStatusDto } from './dtos/update-ticket-status.dto';
import { CreateTicketStatusDto } from './dtos/create-ticket-status.dto';
import { SearchTicketStatusDto } from './dtos/search-ticket-status.dto';

// TODO: Uncomment this after testing
// @UseGuards(AuthGuard, RolesGuard)
// @Roles('admin')
@Controller('ticket-statuses')
export class TicketStatusController {
  constructor(private readonly ticketStatusService: TicketStatusService) {}

  @Get()
  async findAll(@Query() searchTicketStatus: SearchTicketStatusDto) {
    return this.ticketStatusService.findAll(searchTicketStatus);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketStatusService.findById(id);
  }

  @Post()
  async create(@Body() createTicketStatusDto: CreateTicketStatusDto) {
    const { name } = createTicketStatusDto;
    return this.ticketStatusService.create(name);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketStatusDto: UpdateTicketStatusDto,
  ) {
    return this.ticketStatusService.update(id, updateTicketStatusDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.ticketStatusService.delete(id);
  }
}
