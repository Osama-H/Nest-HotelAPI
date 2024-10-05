import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from './user.model';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Role } from 'src/role/role.model';
import { SearchUserDto } from './dtos/search-user.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Booking } from 'src/booking/booking.model';
import { SupportTicket } from 'src/support-ticket/supportTicket.model';
import { TicketResult } from 'src/ticket-result/ticket-result.model';
import { UpdateMeDto } from './dtos/update-me-dto';
import { UploadService } from 'src/upload/upload.service';
import { retry } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly sequelize: Sequelize,
    private readonly uploadService: UploadService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async hashedData(data: string) {
    const saltRounds = 12;
    return await bcrypt.hash(data, saltRounds);
  }

  async generateVerificationCode() {
    return crypto.randomBytes(3).toString('hex');
  }

  async findUserWithTheRole(userId: number) {
    const user = await User.findByPk(userId, {
      include: {
        model: Role,
        as: 'role',
        attributes: ['name'],
      },
    });
    return user;
  }

  async createUser(
    username: string,
    email: string,
    password: string,
    photo: any,
  ) {
    const verificationCode = await this.generateVerificationCode();
    const verificationCodeExpires = new Date();
    verificationCodeExpires.setHours(verificationCodeExpires.getHours() + 1);

    return this.sequelize.transaction(async (transaction) => {
      const newUser = await this.userModel.create(
        {
          username,
          email,
          password,
          role: 'user',
          isVerified: false,
          photoUrl: 'defaultOne',
          verificationCode,
          verificationCodeExpires,
          roleId: 2,
        },
        {
          transaction,
        },
      );
      // if (photo) {
      //   console.log(photo);
      //   const uploadResult = await this.cloudinaryService.uploadFile(photo);
      //   await this.userModel.update(
      //     {
      //       photoUrl: uploadResult.secure_url,
      //     },
      //     {
      //       where: {
      //         email,
      //       },
      //       transaction,
      //     },
      //   );
      // }
      return newUser;
    });
  }

  async getUsersEmailByRoleId(roleId: number) {
    const users = await User.findAll({
      where: { roleId },
    });

    const emails = users.map((user) => user.email);
    return emails;
  }

  async findUserByEmail(email: string) {
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, attributes: ['name'] }],
    });
    if (!user) {
      throw new NotFoundException('User_Not_Found');
    }
    return user;
  }

  async findUserByResetToken(token: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { [Op.gte]: Date.now() },
      },
    });
    if (!user) {
      throw new NotFoundException('Token is invalid or has expired');
    }
    return user;
  }

  async findUserByVerificationCode(code: string) {
    const user = await this.userModel.findOne({
      where: { verificationCode: code },
    });
    if (!user) {
      throw new NotFoundException('User_Not_Found');
    }
    return user;
  }

  async verifiyAccount(id: number) {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException('User_Not_Found');
    }
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();
  }

  async findAll(searchUserDto: SearchUserDto) {
    console.log('INSIDE OUR SERVICE');
    const { name, page = 1, limit = 5 } = searchUserDto;
    const offset = limit * (page - 1);
    console.log(name, page, limit, offset);
    const where: any = {};
    if (name) {
      where.username = {
        [Op.like]: `${name}%`,
      };
    }
    const users = await User.findAll({
      where,
      limit,
      offset,
      include: [{ model: Role, as: 'role', attributes: ['name'] }],
    });
    return users;
  }

  async findOne(id: number) {
    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'email', 'photoUrl'],
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['name'],
        },
        {
          model: Booking,
        },
        {
          model: SupportTicket,
          include: [
            {
              model: TicketResult,
              attributes: ['id', 'description', 'adminId', 'createdAt'],
            },
          ],
        },
      ],
    });

    let photoUrl = user.photoUrl;
    if (photoUrl) {
      photoUrl = await this.uploadService.getSignedUrl(photoUrl, 'user');
    }

    return user;
  }

  async getMe(id: number) {
    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'email', 'photoUrl'],
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['name'],
        },
        {
          model: Booking,
        },
        {
          model: SupportTicket,
          include: [
            {
              model: TicketResult,
              attributes: ['id', 'description', 'adminId', 'createdAt'],
            },
          ],
        },
      ],
    });

    let photoUrl = user.photoUrl;
    if (photoUrl) {
      photoUrl = await this.uploadService.getSignedUrl(photoUrl, 'user');
    } else {
      photoUrl = await this.uploadService.getSignedUrl('defaultOne', 'user');
    }

    return { user, photoUrl };
  }

  async updateOne(id: number, updateMeDto: UpdateMeDto, file: any) {
    let uploadResult;
    // console.log(file);

    if (file) {
      const fileName = `user-${id}-${Date.now()}`;
      await this.uploadService.upload(fileName, file.buffer, 'user');
      updateMeDto.photoUrl = fileName;
    }
    console.log(updateMeDto);

    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException('User_Not_Found');
    }

    await user.update(updateMeDto);
    return user;
  }

  async deletePhoto(id: number) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException('User_Not_Found');
    }

    await user.update({ photoUrl: 'defaultOne' });

    return {
      message: 'Photo has been deleted and reverted to the default photo',
      user,
    };
  }
}
