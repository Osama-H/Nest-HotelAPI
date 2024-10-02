import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Amenity } from './amenity.model';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateAmenityDto } from './dtos/update-amenity.dto';

@Injectable()
export class AmenityService {
  constructor(
    @InjectModel(Amenity) private readonly amenityModel: typeof Amenity,
  ) {}

  async findByIds(amenityIds: number[]) {
    const amenities = await this.amenityModel.findAll({
      where: { id: amenityIds },
    });

    return amenities;
  }

  async findByName(name: string): Promise<Amenity> {
    return this.amenityModel.findOne({ where: { name: name.toLowerCase() } });
  }
  async create(name: string, description: string): Promise<Amenity> {
    const foundAmenity = await this.findByName(name);
    if (foundAmenity) {
      throw new ConflictException('AMENITY_ALREADY_EXISTS');
    }
    return this.amenityModel.create({ name: name.toLowerCase(), description });
  }

  async findAll() {
    const amenities = await this.amenityModel.findAll();

    return amenities;
  }

  async findOne(id: number) {
    const foundAmenity = await this.amenityModel.findByPk(id);
    if (!foundAmenity) throw new NotFoundException('AMENITY_NOT_FOUND');
    const amenity = await this.amenityModel.findByPk(id);
    return amenity;
  }

  async update(id: number, updateAmenityDto: UpdateAmenityDto) {
    const amenity = await this.findOne(id);
    await amenity.update(updateAmenityDto);
    return amenity;
  }
}
