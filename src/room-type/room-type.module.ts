import { Module } from '@nestjs/common';
import { RoomTypeService } from './room-type.service';
import { RoomTypeController } from './room-type.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoomType } from './roomType.model';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([RoomType]), UserModule, AuthModule],
  providers: [RoomTypeService],
  controllers: [RoomTypeController],
  exports: [RoomTypeService],
})
export class RoomTypeModule {}
