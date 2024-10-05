import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  Param,
  UseInterceptors,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { HotelPhotoService } from './hotel-photo.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { imageFileValidation } from 'src/pipes/file-validation.pipe';

@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
@Controller('hotel-photo')
export class HotelPhotoController {
  constructor(private readonly hotelPhotoService: HotelPhotoService) {}

  @Post('upload-primary/:hotelId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPrimaryPhoto(
    @Param('hotelId') hotelId: number,
    @UploadedFile(imageFileValidation)
    file: Express.Multer.File,
  ) {
    return this.hotelPhotoService.uploadPrimaryHotelPhoto(hotelId, file);
  }

  @Post('upload-photos/:hotelId')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadAdditionalPhotos(
    @Param('hotelId') hotelId: number,
    @UploadedFiles(imageFileValidation)
    files: Express.Multer.File[],
  ) {
    return await this.hotelPhotoService.uploadAdditionalHotelPhotos(
      hotelId,
      files,
    );
  }

  @Delete('delete-primary/:hotelId')
  async deletePrimaryPhoto(@Param('hotelId') hotelId: number) {
    return this.hotelPhotoService.deletePrimaryPhoto(hotelId);
  }

  @Delete('delete-secondary/:hotelId/:photoId')
  async deleteSecondaryPhoto(
    @Param('hotelId') hotelId: number,
    @Param('photoId') photoId: number,
  ) {
    return this.hotelPhotoService.deleteSecondaryPhoto(hotelId, photoId);
  }
}
