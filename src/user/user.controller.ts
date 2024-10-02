import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SearchUserDto } from './dtos/search-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { getCurrentUserId } from 'src/decorators/get-current-user-id.decorator';
import { UpdateMeDto } from './dtos/update-me-dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Query() searchUserDto: SearchUserDto) {
    return await this.userService.findAll(searchUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('my-profile')
  async getMyProfile(@getCurrentUserId() userId: number) {
    return await this.userService.findOne(userId);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch('update-me')
  async updateMe(
    @getCurrentUserId() userId: number,
    @Body() updateMeDto: UpdateMeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userService.updateOne(userId, updateMeDto, file);
  }
}
