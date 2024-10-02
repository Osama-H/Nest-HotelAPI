import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Country } from './country.model';
import { Hotel } from 'src/hotel/models/hotel.model';
import { CreateCountryDto } from './dtos/create-country.dto';
import { UpdateCountryDto } from './dtos/update-country.dto';
import { SearchCountryDto } from './dtos/search-country.dto';

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(Country) private readonly countryModel: typeof Country,
  ) {}

  async findAll(searchCountryDto: SearchCountryDto) {
    const { name } = searchCountryDto;
    const where: any = {};
    if (name) {
      where.name = where.name = { [Op.iLike]: `${name.toLowerCase()}%` };
    }

    return this.countryModel.findAll({
      where,
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
  }

  async findById(id: number) {
    const country = await this.countryModel.findByPk(id, {
      include: [
        {
          model: Hotel,
          attributes: ['name', 'starts', 'latitude', 'longitude'],
        },
      ],

      order: [[{ model: Hotel, as: 'hotels' }, 'starts', 'DESC']],
    });
    if (!country) throw new NotFoundException('COUNTRY_NOT_FOUND');
    return country;
  }

  async findByName(name: string) {
    return this.countryModel.findOne({
      where: { name: name.toLowerCase() },
    });
  }

  async create(createCountryDto: CreateCountryDto) {
    const { name, code, description } = createCountryDto;
    const existingCountry = await this.findByName(name);
    if (existingCountry) {
      throw new ConflictException('COUNTRY_ALREADY_EXISTS');
    }
    return this.countryModel.create({
      name: name.toLowerCase(),
      code,
      description,
    });
  }

  async update(id: number, updateCountryDto: UpdateCountryDto) {
    const country = await this.findById(id);
    if (!country) throw new NotFoundException('COUNTRY_NOT_FOUND');

    await this.countryModel.update(updateCountryDto, {
      where: { id },
    });
    return this.findById(id);
  }

  async delete(id: number) {
    const country = await this.findById(id);
    if (!country) {
      throw new NotFoundException('COUNTRY_NOT_FOUND');
    }
    await this.countryModel.destroy({ where: { id } });
    return { message: 'Country deleted successfully' };
  }
}
