import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoomType } from './roomType.model';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateRoomTypeDto } from './dtos/update-room-type.dto';

@Injectable()
export class RoomTypeService {
  constructor(
    @InjectModel(RoomType) private readonly roomTypeModel: typeof RoomType,
  ) {}

  async findAll() {
    return this.roomTypeModel.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
  }

  async delete(id: number) {
    const findRoomType = await this.findById(+id);
    if (!findRoomType) {
      throw new NotFoundException('ROOM_TYPE_NOT_FOUND');
    }
    await this.roomTypeModel.destroy({ where: { id } });
    return 'Room Type Deleted Successfully';
  }

  async findById(id: number) {
    const roomType = await this.roomTypeModel.findByPk(id);
    return roomType;
  }

  async findByName(name: string) {
    const roomType = await this.roomTypeModel.findOne({
      where: { name: name.toLowerCase() },
    });
    return roomType;
  }
  async create(name: string, description: string) {
    const foundRoomType = await this.findByName(name);
    if (foundRoomType) {
      throw new ConflictException('ROOM_TYPE_ALREADY_EXISTS');
    }
    const roomType = await this.roomTypeModel.create({
      name: name.toLowerCase(),
      description,
    });
    return roomType;
  }

  async update(id: number, updateRoomTypeDto: UpdateRoomTypeDto) {
    const roomType = await this.findById(id);
    if (!roomType) throw new NotFoundException('ROOMTYPE_NOT_FOUND');

    const updateRoomType = await this.roomTypeModel.update(updateRoomTypeDto, {
      where: { id },
      returning: true,
    });
    return updateRoomType;
  }
}
