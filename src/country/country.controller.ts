import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dtos/create-country.dto';
import { UpdateCountryDto } from './dtos/update-country.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { SearchCountryDto } from './dtos/search-country.dto';

// TODO: Uncomment after testing
// @UseGuards(AuthGuard, RolesGuard)
// @Roles('admin')
@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async findAll(@Query() searchCountryDto: SearchCountryDto) {
    return this.countryService.findAll(searchCountryDto);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.countryService.findById(id);
  }

  @Post()
  async create(@Body() createCountryDto: CreateCountryDto) {
    return this.countryService.create(createCountryDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCountryDto: UpdateCountryDto,
  ) {
    return this.countryService.update(id, updateCountryDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.countryService.delete(id);
  }
}
