import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateHotelDto } from './dtos/create-hotel.dto';
import { UpdateHotelDto } from './dtos/update-hotel.dto';
import { SearchHotelDto } from './dtos/search-hotel.dto';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  // TODO: Uncomment this after testing
  @UseGuards(AuthGuard, RolesGuard)
  // @Roles('admin')
  @Get('allHotels')
  async getAllHotelsIncludingDeleted() {
    const hotels = await this.hotelService.getAlHotelsIncludingDeleted();
    return hotels;
  }

  // TODO: add latitude and longitude to SearchHotelDto 
  @Get()
  async getHotels(
    @Query() searchHotelDto: SearchHotelDto,
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
  ) {
    const hotels = await this.hotelService.findAll(
      searchHotelDto,
      latitude,
      longitude,
    );
    return hotels;
  }

  // TODO: Uncomment this after testing

  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles('admin')
  @Patch(':id')
  async updateHotel(
    @Param('id') id: number,
    @Body() updateHotelDto: UpdateHotelDto,
  ) {
    return this.hotelService.updateHotel(id, updateHotelDto);
  }

  // TODO: Uncomment this after testing
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles('admin')
  @Post()
  async createHotel(@Body() createHotelDto: CreateHotelDto) {
    const {
      name,
      starts,
      description,
      latitude,
      longitude,
      countryId,
      cityId,
      contactInfo,
      amenityIds,
    } = createHotelDto;
    const newHotel = await this.hotelService.create(
      name,
      starts,
      description,
      latitude,
      longitude,
      countryId,
      cityId,
      contactInfo,
      amenityIds,
    );
    return newHotel;
  }

  @Get(':id')
  async getHotelById(@Param('id') id: number) {
    const foundHotel = await this.hotelService.findById(id, true);
    return foundHotel;
  }

  // TODO: Uncomment this after testing
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles('admin')

  @Delete(':id')
  async deleteHotel(@Param('id') id: number) {
    return this.hotelService.delete(id);
  }

  // TODO: Uncomment this after testing
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles('admin')
  @Patch('restore/:id')
  async restoreHotel(@Param('id') id: number) {
    return this.hotelService.restore(id);
  }
}
