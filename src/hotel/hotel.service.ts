import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Hotel } from './models/hotel.model';
import { Room } from 'src/room/room.model';
import { Country } from 'src/country/country.model';
import { City } from 'src/city/city.model';
import { ContactInfo } from './models/contactInfo.model';
import { Sequelize } from 'sequelize-typescript';
import { UpdateHotelDto } from './dtos/update-hotel.dto';
import { SearchHotelDto } from './dtos/search-hotel.dto';
import { haversineDistance } from '../utils/distance';
import { Amenity } from 'src/amenity/amenity.model';
import { AmenityService } from 'src/amenity/amenity.service';
import { Review } from 'src/review/review.model';
import { HotelPhotoService } from 'src/hotel-photo/hotel-photo.service';

@Injectable()
export class HotelService {
  constructor(
    @InjectModel(Hotel) private readonly hotelModel: typeof Hotel,
    @InjectModel(ContactInfo)
    private readonly contactInfoModel: typeof ContactInfo,
    private readonly amenityService: AmenityService,
    private readonly hotelPhotoService: HotelPhotoService,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(searchHotelDto: SearchHotelDto, userLatitude, userLongitude) {
    const { name, minStarts, maxStarts, page = 1, limit = 5 } = searchHotelDto;

    const offset = limit * (page - 1);

    const where: any = {};
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }

    if (minStarts && maxStarts) {
      where.starts = { [Op.between]: [minStarts, maxStarts] };
    } else if (minStarts) {
      where.starts = { [Op.gte]: minStarts };
    } else if (maxStarts) {
      where.starts = { [Op.lte]: maxStarts };
    }

    const hotels = await this.hotelModel.findAll({
      where,
      limit,
      offset,
      include: [{ model: Room, attributes: ['number', 'price'] }],
    });

    const hotelsWithDetails = hotels.map((hotel) => {
      const roomPrices = hotel.rooms.map((room) => room.price);
      const minRoomPrice = Math.min(...roomPrices);

      return {
        ...hotel.get(),
        distance: haversineDistance(
          userLatitude,
          userLongitude,
          hotel.latitude,
          hotel.longitude,
        ),
        priceStartedFrom: `${minRoomPrice}$ per day`,
      };
    });

    // Sort by distance
    hotelsWithDetails.sort((a, b) => a.distance - b.distance);

    return hotelsWithDetails;
  }

  async updateHotel(id: number, updateHotelDto: UpdateHotelDto) {
    const { contactInfo, ...hotelProp } = updateHotelDto;

    return this.sequelize.transaction(async (transaction) => {
      await this.hotelModel.update(hotelProp, { where: { id }, transaction });
      await this.contactInfoModel.update(contactInfo, {
        where: { hotelId: id },
        transaction,
      });
      return 'Updated Successfully!';
    });
  }

  async create(
    name: string,
    stars: number,
    description: string,
    latitude: number,
    longitude: number,
    countryId: number,
    cityId: number,
    contactInfo: any,
    amenityIds: number[],
  ) {
    return this.sequelize.transaction(async (transaction) => {
      const newHotel = await this.hotelModel.create(
        {
          name,
          stars,
          description,
          latitude,
          longitude,
          countryId,
          cityId,
        },
        {
          transaction,
        },
      );

      await this.contactInfoModel.create(
        {
          email: contactInfo.email,
          telephone: contactInfo.phone,
          fax: contactInfo.fax,
          hotelId: newHotel.id,
        },
        {
          transaction,
        },
      );

      const amenities = await this.amenityService.findByIds(amenityIds);

      await newHotel.$set('amenities', amenities, {
        transaction,
      });

      return newHotel;
    });
  }
  async findById(id: number, includeDetails: boolean) {
    const includeOptions = includeDetails
      ? [
          {
            model: Room,
            attributes: {
              exclude: ['updatedAt', 'createdAt', 'hotelId'],
            },
          },
          {
            model: Country,
            attributes: ['name', 'code'],
          },
          {
            model: City,
            attributes: ['name'],
          },
          {
            model: Amenity,
            attributes: ['name'],
          },
          {
            model: Review,
            attributes: ['rating', 'review', 'userId', 'createdAt'],
          },
        ]
      : [];

    const foundHotel = await this.hotelModel.findByPk(id, {
      include: includeOptions,
    });

    if (!foundHotel) {
      throw new NotFoundException('HOTEL_NOT_FOUND');
    }

    let avgReviews = 0;
    if (includeDetails && foundHotel.reviews) {
      const reviews = foundHotel.reviews;
      avgReviews = reviews.length
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;
    }
    const numOfRooms = foundHotel.getRoomCount();

    const primaryPhoto = await this.hotelPhotoService.getPrimaryPhoto(
      foundHotel.id,
    );
    const allPhotos = await this.hotelPhotoService.getAllPhotos(foundHotel.id);

    return {
      ...foundHotel.toJSON(),
      avgReviews,
      numOfRooms,
      primaryPhoto,
      allPhotos,
    };
  }
  async findByName(name: string) {
    const foundHotel = await this.hotelModel.findOne({
      where: { name },
      include: {
        model: Country,
      },
    });
    if (!foundHotel) throw new NotFoundException('HOTEL_NOT_FOUND');
    return foundHotel;
  }
  async delete(id: number) {
    const foundHotel = await this.findById(id, false);
    if (!foundHotel) throw new NotFoundException('HOTEL_NOT_FOUND');
    await this.hotelModel.destroy({ where: { id } });
    return 'Hotel Deleted Successfully';
  }

  async findByIdIncludingDeleted(id: number) {
    const foundHotel = await this.hotelModel.findByPk(id, { paranoid: false });
    return foundHotel;
  }

  async restore(id: number) {
    const foundHotel = await this.findByIdIncludingDeleted(id);

    if (!foundHotel) {
      throw new NotFoundException('HOTEL_NOT_FOUND');
    }

    if (!foundHotel.deletedAt) {
      return 'Hotel is already active';
    }

    await this.hotelModel.restore({ where: { id } });
    return 'Hotel Restored Successfully';
  }
  async getAlHotelsIncludingDeleted() {
    return await this.hotelModel.findAll({ paranoid: false });
  }
}
