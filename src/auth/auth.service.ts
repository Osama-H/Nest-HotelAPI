import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/user/user.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  private readonly logger = new Logger(UserService.name);

  async getToken(id: number, email: string) {
    return this.jwtService.signAsync(
      { id, email },
      {
        secret: 'at-secret',
      },
    );
  }

  async signup(username: string, email: string, password: string, photo: any) {
    const hashedPassword = await this.userService.hashedData(password);
    const newUser = await this.userService.createUser(
      username,
      email,
      hashedPassword,
      photo,
    );

    await this.emailService.sendVerificationCode(
      newUser.email,
      newUser.verificationCode,
    );
    this.logger.log('All OKay, user created!');

    // const token = await this.getToken(newUser.id, newUser.email);
    return 'VerificationCode sent to your Email';
  }

  async login(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);

    if (!(await user.comparePassword(password))) {
      throw new UnauthorizedException(
        'Password_Not_Correct, Or Your Account isnt verified',
      );
    }
    const token = await this.getToken(user.id, user.email);
    return token;
  }

  async verifiyAccount(code: string) {
    const user = await this.userService.findUserByVerificationCode(code);
    if (new Date() > user.verificationCodeExpires) {
      throw new UnauthorizedException('Verification_Code_Expired');
    }
    await this.userService.verifiyAccount(user.id);
    return 'Account Verified Successully!';
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findUserByEmail(email);
    const resetToken = await user.setPasswordResetToken();

    await this.emailService.sendPasswordResetToken(user.email, resetToken);

    return 'VerificationCode sent to your Email';
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userService.findUserByResetToken(token);
    const hashedPassword = await this.userService.hashedData(newPassword);
    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();
    return 'Password Changes Successfully!';
  }
}
