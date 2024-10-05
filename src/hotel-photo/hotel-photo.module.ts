import { Module } from '@nestjs/common';
import { HotelPhotoController } from './hotel-photo.controller';
import { HotelPhotoService } from './hotel-photo.service';
import { HotelPhoto } from './hotel-photo.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UploadModule } from 'src/upload/upload.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([HotelPhoto]),
    UserModule,
    AuthModule,
    UploadModule,
  ],
  controllers: [HotelPhotoController],
  providers: [HotelPhotoService],
  exports: [HotelPhotoService],
})
export class HotelPhotoModule {}
