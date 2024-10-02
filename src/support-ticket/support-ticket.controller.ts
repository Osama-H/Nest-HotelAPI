import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SupportTicketService } from './support-ticket.service';
import { SupportTiecketDto } from './dtos/create-support-ticket.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { getCurrentUserId } from 'src/decorators/get-current-user-id.decorator';
import { SearchSupportTicketDto } from './dtos/search-support-ticket.dto';
import { UpdateSupportTicketDto } from './dtos/update-support-ticket.dto';
import { getCurrentUserRoles } from 'src/decorators/getCurrentUserRoles.decorator';

@Controller('support-ticket')
export class SupportTicketController {
  constructor(private readonly supportTicketService: SupportTicketService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('user')
  @Post()
  async create(
    @Body() supportTiecketDto: SupportTiecketDto,
    @getCurrentUserId() userId: number,
  ) {
    const supportTicket = await this.supportTicketService.create(
      supportTiecketDto,
      userId,
    );
    return supportTicket;
  }

  // TODO: uncomment this
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  async findAll(
    @Query() searchSupportTicketDto: SearchSupportTicketDto,
    @getCurrentUserId() userId: number,
    @getCurrentUserRoles() role: string,
  ) {
    const isAdmin = role.includes('admin');

    const supportTickets = await this.supportTicketService.findAll(
      searchSupportTicketDto,
      userId,
      isAdmin,
    );
    return supportTickets;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @getCurrentUserId() userId: number,
    @getCurrentUserRoles() role: string,
  ) {
    const isAdmin = role.includes('admin');

    return this.supportTicketService.findByIdForLoggedIn(id, userId, isAdmin);
  }

  // TODO: uncomment this
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('user')
  @Patch(':id')
  async updateSupportTicket(
    @Param('id') id: number,
    @Body() updateSupportTicketDto: UpdateSupportTicketDto,
    @getCurrentUserId() userId: number,
  ) {
    const updatedTicket = await this.supportTicketService.update(
      id,
      updateSupportTicketDto,
      userId,
    );
    return updatedTicket;
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteSupportTicket(
    @Param('id', ParseIntPipe) id: number,
    @getCurrentUserId() userId: number,
    @getCurrentUserRoles() role: string,
  ) {
    const isAdmin = role.includes('admin');

    console.log('isAdmin', isAdmin);
    return await this.supportTicketService.delete(id, userId, isAdmin);
  }
}
