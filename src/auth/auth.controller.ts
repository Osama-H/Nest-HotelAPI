import {
  Body,
  Controller,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { VerifyAccountDto } from './dtos/verify-account.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('signup')
  async signup(
    @Body() signupDto: SignupDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { username, email, password } = signupDto;
    return await this.authService.signup(username, email, password, file);
  }
  @Post('login')
  // @UseGuards(PassportLocalGuard)
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    return await this.authService.login(email, password);
  }

  @Post('verify-account')
  async verifyAccount(@Query('code') verifyAccountDto: VerifyAccountDto) {
    const { code } = verifyAccountDto;
    return await this.authService.verifiyAccount(code);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: any) {
    const { email } = body;
    const resetToken = await this.authService.forgotPassword(email);
    return resetToken;
  }

  @Patch('reset-password')
  async resetPassword(
    @Query('resetToken') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    const { newPassword } = resetPasswordDto;
    const resetPassword = await this.authService.resetPassword(
      token,
      newPassword,
    );
    return resetPassword;
  }
}
