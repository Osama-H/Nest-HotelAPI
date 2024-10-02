import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { CreateTicketResultDto } from './dtos/create-ticket-result.dto';
import { TicketResultService } from './ticket-result.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { getCurrentUserId } from 'src/decorators/get-current-user-id.decorator';
import { DeleteTicketResultDto } from './dtos/delete-ticket-result.dto';

@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
@Controller('ticket-result')
export class TicketResultController {
  constructor(private readonly ticketResultService: TicketResultService) {}

  @Post()
  async create(
    @Body() createTicketResultDto: CreateTicketResultDto,
    @getCurrentUserId() adminId: number,
  ) {
    return await this.ticketResultService.create(
      createTicketResultDto,
      adminId,
    );
  }

  @Delete()
  async delete(
    @Body() deleteTicketResultDto: DeleteTicketResultDto,
    @getCurrentUserId() adminId: number,
  ) {
    return await this.ticketResultService.delete(
      deleteTicketResultDto,
      adminId,
    );
  }
}
