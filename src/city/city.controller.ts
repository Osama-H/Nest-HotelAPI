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
  ParseIntPipe,
} from '@nestjs/common';
import { CityService } from './city.service';
import { CreateCityDto } from './dtos/create-city.dto';
import { UpdateCityDto } from './dtos/update-city.dto';
import { SearchCityDto } from './dtos/search-city.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';

// TODO: Uncomment after testing
// @UseGuards(AuthGuard, RolesGuard)
// @Roles('admin')
@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  async findAll(@Query() searchCityDto: SearchCityDto) {
    return this.cityService.findAll(searchCityDto);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.cityService.findById(id);
  }

  @Post()
  async create(@Body() createCityDto: CreateCityDto) {
    return this.cityService.create(createCityDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCityDto: UpdateCityDto,
  ) {
    return this.cityService.update(id, updateCityDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.cityService.delete(id);
  }
}
