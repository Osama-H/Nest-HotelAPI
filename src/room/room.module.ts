import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Room } from './room.model';
import { HotelModule } from 'src/hotel/hotel.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { RoomTypeModule } from 'src/room-type/room-type.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Room]),
    UserModule,
    AuthModule,
    HotelModule,
    RoomTypeModule,
  ],
  providers: [RoomService],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {}
