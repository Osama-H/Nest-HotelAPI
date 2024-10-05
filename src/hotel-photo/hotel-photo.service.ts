import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HotelPhoto } from './hotel-photo.model';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class HotelPhotoService {
  constructor(
    @InjectModel(HotelPhoto) private hotelPhotoModel: typeof HotelPhoto,
    private uploadService: UploadService,
  ) {}

  async uploadPrimaryHotelPhoto(hotelId: number, file: Express.Multer.File) {
    const existingPrimaryPhoto = await this.hotelPhotoModel.findOne({
      where: { hotelId, isPrimary: true },
    });

    if (existingPrimaryPhoto) {
      await existingPrimaryPhoto.destroy();
    }

    const fileName = `hotel-${hotelId}-${Date.now()}`;
    await this.uploadService.upload(fileName, file.buffer, 'hotel');

    return this.hotelPhotoModel.create({
      url: fileName,
      hotelId,
      isPrimary: true,
    });
  }

  async uploadAdditionalHotelPhotos(
    hotelId: number,
    files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const results = [];

    for (const file of files) {
      const fileName = `hotel-${hotelId}-${Date.now()}`;
      await this.uploadService.upload(fileName, file.buffer, 'hotel');

      const photo = await this.hotelPhotoModel.create({
        url: fileName,
        hotelId,
        isPrimary: false,
      });
      results.push(photo);
    }

    return results;
  }

  async getPrimaryPhoto(hotelId: number) {
    const photo = await this.hotelPhotoModel.findOne({
      where: { hotelId, isPrimary: true },
    });
    if (!photo) {
      return '';
    }
    return this.uploadService.getSignedUrl(photo.url, 'hotel');
  }

  async getAllPhotos(hotelId: number) {
    const photos = await this.hotelPhotoModel.findAll({
      where: {
        hotelId,
        isPrimary: false,
      },
    });
    return Promise.all(
      photos.map(async (photo) => {
        const url = await this.uploadService.getSignedUrl(photo.url, 'hotel');
        return { ...photo.toJSON(), url };
      }),
    );
  }

  async deletePrimaryPhoto(hotelId: number) {
    const primaryPhoto = await this.hotelPhotoModel.findOne({
      where: { hotelId, isPrimary: true },
    });

    if (!primaryPhoto) {
      throw new NotFoundException('Primary photo not found');
    }

    await primaryPhoto.destroy();

    return { message: 'Primary photo deleted successfully' };
  }

  async deleteSecondaryPhoto(hotelId: number, photoId: number) {
    const secondaryPhoto = await this.hotelPhotoModel.findOne({
      where: { id: photoId, hotelId, isPrimary: false },
    });

    if (!secondaryPhoto) {
      throw new NotFoundException('Secondary photo not found for this hotel');
    }

    await secondaryPhoto.destroy();

    return { message: 'Secondary photo deleted successfully' };
  }
}
