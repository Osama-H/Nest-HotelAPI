import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dtos/create-room.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { getCurrentUserId } from 'src/decorators/get-current-user-id.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { UpdateRoomDto } from './dtos/update-room.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('available')
  async findAllAvailable(
    @Query('checkInDate') checkInDateStr: string,
    @Query('checkOutDate') checkOutDateStr: string,
  ) {
    const checkInDate = new Date(checkInDateStr);
    const checkOutDate = new Date(checkOutDateStr);

    const rooms = await this.roomService.findAvBetween(
      checkInDate,
      checkOutDate,
    );
    return rooms;
  }

  // For Admin
  @Get('available-now')
  async findAllAvailableNow() {
    const now = new Date();
    const rooms = await this.roomService.findAllAvailable(now);
    return rooms;
  }

  // TODO: uncomment this after testing
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  // @Roles('admin')
  async createRoom(
    @getCurrentUserId() userId: number,
    @Body() createRoomDto: CreateRoomDto,
  ) {
    const {
      number,
      floor,
      price,
      capacity,
      availability,
      hotelId,
      roomTypeId,
    } = createRoomDto;
    const newRoom = await this.roomService.create(
      number,
      floor,
      price,
      capacity,
      availability,
      hotelId,
      roomTypeId,
    );
    return newRoom;
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const room = await this.roomService.findById(+id);
    return room;
  }

  // TODO: uncomment this after testing
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  // @Roles('admin')
  async updateRoom(
    @Param('id') id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomService.update(+id, updateRoomDto);
  }

  // TODO: uncomment this after testing
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  // @Roles('admin')
  async deleteRoom(@Param('id') id: number) {
    return this.roomService.delete(+id);
  }
}
