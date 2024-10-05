import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.model';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { CustomCacheModule } from 'src/cache/cache.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryProvider } from 'src/cloudinary/cloudinary.provider';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [
    CustomCacheModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: 'secret-key',
      signOptions: { expiresIn: '10h' },
    }),
    SequelizeModule.forFeature([User]),
    UploadModule,
  ],
  providers: [
    AuthService,
    UserService,
    JwtService,
    EmailService,
    LocalStrategy,
    CloudinaryService,
    CloudinaryProvider,
  ],
  controllers: [AuthController],
  exports: [AuthModule],
})
export class AuthModule {}
