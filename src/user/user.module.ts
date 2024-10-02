import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserService } from './user.service';
import { User } from './user.model';
import { CustomCacheModule } from 'src/cache/cache.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CloudinaryProvider } from 'src/cloudinary/cloudinary.provider';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
// import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),

    CustomCacheModule,
    CloudinaryModule,
  ],
  providers: [UserService, CloudinaryProvider, CloudinaryService],
  exports: [UserService],
})
export class UserModule {}
