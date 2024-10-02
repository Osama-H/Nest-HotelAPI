import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AmenityService } from './amenity.service';
import { CreateAmenityDto } from './dtos/create-amenity.dto';
import { UpdateAmenityDto } from './dtos/update-amenity.dto';

@Controller('amenity')
export class AmenityController {
  constructor(private readonly amenityService: AmenityService) {}

  @Post()
  create(@Body() createAmenityDto: CreateAmenityDto) {
    const { name, description } = createAmenityDto;
    return this.amenityService.create(name, description);
  }

  @Get()
  findAll() {
    return this.amenityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.amenityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateAmenityDto: UpdateAmenityDto) {
    return this.amenityService.update(+id, updateAmenityDto);
  }
}
