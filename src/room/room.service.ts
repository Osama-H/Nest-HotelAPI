import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Room } from './room.model';
import { HotelService } from 'src/hotel/hotel.service';
import { Booking } from 'src/booking/booking.model';
import { RoomTypeService } from 'src/room-type/room-type.service';
import { RoomType } from 'src/room-type/roomType.model';
import { Amenity } from 'src/amenity/amenity.model';
import { UpdateRoomDto } from './dtos/update-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room) private readonly roomModel: typeof Room,
    private readonly hotelService: HotelService,
    private readonly roomTypeService: RoomTypeService,
  ) {}

  async findById(id: number): Promise<Room> {
    const room = await this.roomModel.findByPk(id, {
      include: [
        {
          model: RoomType,
          attributes: ['name', 'description'],
        },
        {
          model: Booking,
        },
      ],
    });
    if (!room) {
      throw new NotFoundException('ROOM_NOT_FOUND');
    }
    return room;
  }

  // Avaialbe Now For admin
  async findAllAvailable(now: Date) {
    const rooms = await this.roomModel.findAll({
      include: [Booking],
    });

    return rooms.filter((room) => room.isAvailable(now, now));
  }

  async findAvBetween(checkInDate: Date, checkOutDate: Date) {
    const rooms = await this.roomModel.findAll({
      include: [Booking],
    });

    return rooms.filter((room) => room.isAvailable(checkInDate, checkOutDate));
  }

  async create(
    number: string,
    floor: number,
    price: number,
    capacity: number,
    availability: boolean,
    hotelId: number,
    roomTypeId: number,
  ) {
    await this.hotelService.findById(hotelId, false);
    const roomType = await this.roomTypeService.findById(roomTypeId);
    if (!roomType) throw new NotFoundException('ROOM_TYPE_NOT_FOUND');

    const newRoom = await this.roomModel.create({
      number,
      floor,
      price,
      capacity,
      availability,
      hotelId,
      roomTypeId,
    });
    return newRoom;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    const room = await this.findById(id);
    if (!room) throw new NotFoundException('ROOM_NOT_FOUND');

    if (updateRoomDto.roomTypeId) {
      const roomType = await this.roomTypeService.findById(
        updateRoomDto.roomTypeId,
      );
      if (!roomType) throw new NotFoundException('ROOM_TYPE_NOT_FOUND');
    }

    if (updateRoomDto.hotelId) {
      const hotel = await this.hotelService.findById(
        updateRoomDto.hotelId,
        false,
      );
      if (!hotel) throw new NotFoundException('HOTEL_NOT_FOUND');
    }

    const updateRoom = await this.roomModel.update(updateRoomDto, {
      where: { id },
      returning: true,
    });
    return updateRoom;
  }

  async delete(id: number) {
    const room = await this.findById(id);
    if (!room) throw new NotFoundException('ROOM_NOT_FOUND');
    await this.roomModel.destroy({ where: { id } });
  }
}
