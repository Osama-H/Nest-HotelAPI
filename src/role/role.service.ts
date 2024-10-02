import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './role.model';
import { Op } from 'sequelize';
import { SearchRoleDto } from './dtos/search-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role) private readonly roleModel: typeof Role) {}

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);
    if (!role) throw new NotFoundException('ROLE_NOT_FOUND');
    const findRole = await this.findByName(updateRoleDto.name);
    if (findRole) throw new ConflictException('ROLE_ALREADY_EXISTS');
    role.set(updateRoleDto);
    return await role.save();
  }

  async findAll(serchRoleDto: SearchRoleDto) {
    const where: any = {};
    if (serchRoleDto.name) {
      where.name = {
        [Op.like]: `${serchRoleDto.name}%`,
      };
    }

    const roles = this.roleModel.findAll({ where });

    return roles;
  }

  async findByName(name: string) {
    const foundRole = await this.roleModel.findOne({
      where: { name: name.toLowerCase() },
    });

    return foundRole;
  }

  async findOne(id: number) {
    const foundRole = await this.roleModel.findByPk(id);
    return foundRole;
  }
  async create(name: string): Promise<Role> {
    const foundRole = await this.findByName(name);
    if (foundRole) {
      throw new ConflictException('ROLE_ALREADY_EXISTS');
    }
    const role = await this.roleModel.create({ name: name.toLowerCase() });
    return role;
  }
}
