import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { UserService } from 'src/user/user.service';
import { SendEmailDto } from './dtos/send-email.dto';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {}

  @Post('send')
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    const usersEmails = await this.userService.getUsersEmailByRoleId(
      sendEmailDto.roleId,
    );
    await this.emailService.sendBulkEmails(
      usersEmails,
      sendEmailDto.subject,
      sendEmailDto.text,
    );
    return 'Done!';
  }
}
