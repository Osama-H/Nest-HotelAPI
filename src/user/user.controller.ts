import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
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
    return await this.userService.getMe(userId);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch('update-me')
  async updateMe(
    @getCurrentUserId() userId: number,
    @Body() updateMeDto: UpdateMeDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileTypeValidator({
            fileType: /(image\/jpeg|image\/jpg|image\/png)$/i,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.userService.updateOne(userId, updateMeDto, file);
  }

  @UseGuards(AuthGuard)
  @Delete('me/photo')
  async deletePhoto(@getCurrentUserId() id: number) {
    return this.userService.deletePhoto(id);
  }
}
