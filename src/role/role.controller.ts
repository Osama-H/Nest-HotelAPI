import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { SearchRoleDto } from './dtos/search-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto.name);
  }

  @Get()
  async findAll(@Query() serchRoleDto: SearchRoleDto) {
    console.log(serchRoleDto);
    return this.roleService.findAll(serchRoleDto);
  }
}
