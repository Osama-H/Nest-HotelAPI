import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoomTypeService } from './room-type.service';
import { CreateRoomTypeDto } from './dtos/create-room-type.dto';
import { UpdateRoomTypeDto } from './dtos/update-room-type.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';

// TODO: uncomment this after testing .. 
// @UseGuards(AuthGuard, RolesGuard)
// @Roles('admin')
@Controller('room-type')
export class RoomTypeController {
  constructor(private readonly roomTypeService: RoomTypeService) {}

  @Get()
  async findAll() {
    return await this.roomTypeService.findAll();
  }

  @Post()
  async create(@Body() createRoomTypeDto: CreateRoomTypeDto) {
    const { name, description } = createRoomTypeDto;
    return await this.roomTypeService.create(name, description);
  }

  @Patch(':id')
  async update(
    @Body() updateRoomTypeDto: UpdateRoomTypeDto,
    @Param('id') id: number,
  ) {
    return await this.roomTypeService.update(id, updateRoomTypeDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.roomTypeService.delete(id);
  }

  @Get(':id')
  async getRoomType(@Param('id') id: number) {
    return await this.roomTypeService.findById(id);
  }
}
