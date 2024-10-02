import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { City } from './city.model';
import { CountryService } from 'src/country/country.service';
import { CreateCityDto } from './dtos/create-city.dto';
import { UpdateCityDto } from './dtos/update-city.dto';
import { SearchCityDto } from './dtos/search-city.dto';
import { Hotel } from 'src/hotel/models/hotel.model';

@Injectable()
export class CityService {
  constructor(
    @InjectModel(City) private readonly cityModel: typeof City,
    private readonly countryService: CountryService,
  ) {}

  async findAll(searchCityDto: SearchCityDto) {
    const { name, countryId } = searchCityDto;
    const where: any = {};

    if (name) {
      where.name = { [Op.iLike]: `${name.toLowerCase()}%` };
    }

    if (countryId) {
      where.countryId = countryId;
    }

    return this.cityModel.findAll({
      where,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: Hotel,
          attributes: ['name', 'starts', 'latitude', 'longitude'],
        },
      ],
    });
  }

  async findById(id: number) {
    const city = await this.cityModel.findByPk(id, {
      include: [
        {
          model: Hotel,
          attributes: ['name', 'starts', 'latitude', 'longitude'],
        },
      ],
    });
    if (!city) throw new NotFoundException('CITY_NOT_FOUND');
    return city;
  }

  async findByName(name: string, countryId?: number) {
    const where: any = { name: name.toLowerCase() };
    if (countryId) {
      where.countryId = countryId;
    }
    return this.cityModel.findOne({ where });
  }

  async create(createCityDto: CreateCityDto) {
    const { name, countryId } = createCityDto;

    const existingCity = await this.findByName(name, countryId);
    if (existingCity) {
      throw new ConflictException('CITY_ALREADY_EXISTS_IN_COUNTRY');
    }

    await this.countryService.findById(countryId);

    const city = await this.cityModel.create({
      name: name.toLowerCase(),
      countryId,
    });
    return city;
  }

  async update(id: number, updateCityDto: UpdateCityDto) {
    const country = await this.findById(id);
    if (!country) throw new NotFoundException('COUNTRY_NOT_FOUND');

    await this.cityModel.update(updateCityDto, {
      where: { id },
    });
    return this.findById(id);
  }

  async delete(id: number) {
    const city = await this.findById(id);
    if (!city) throw new NotFoundException('CITY_NOT_FOUND');
    await this.cityModel.destroy({ where: { id } });
    return { message: 'City deleted successfully' };
  }
}
