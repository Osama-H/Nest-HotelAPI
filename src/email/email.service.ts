import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private tansporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.tansporter = nodemailer.createTransport({
      host: 'smtp-relay.sendinblue.com',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get<string>('SENDINBLUE_USERNAME'),
        pass: this.configService.get<string>('SENDINBLUE_PASSWORD'),
      },
    });
  }

  async sendVerificationCode(to: string, code: string) {
    console.log(this.configService.get('SENDINBLUE_USERNAME'));
    const mailOptions = {
      from: 'osamaeljamala@gmail.com',
      to,
      subject: 'Verify Your Email',
      text: `Your Verification Code is:${code}`,
    };
    this.tansporter.sendMail(mailOptions);
  }

  async sendPasswordResetToken(to: string, resetToken: string) {
    const mailOptions = {
      from: 'osamaeljamala@gmail.com',
      to,
      subject: 'Password Reset Token',
      text: `Your Password Reset Token is:${resetToken}`,
    };
    this.tansporter.sendMail(mailOptions);
  }

  async sendBulkEmails(recipients: string[], subject: string, text: string) {
    const mailOptions = {
      from: 'osamaeljamala@gmail.com',
      to: recipients.join(','),
      subject,
      text,
    };
    this.tansporter.sendMail(mailOptions);
  }

  async sendBookingConfirmationEmail(to: string, bookingDetails: any) {
    const {
      checkInDate,
      checkOutDate,
      room,
      totalAmount,
      coupon,
      paymentStatus,
    } = bookingDetails;

    const mailOptions = {
      from: 'osamaeljamala@gmail.com', // Sender email
      to,
      subject: 'Booking Confirmation',
      text: `
        Dear User,
  
        Your booking has been successfully confirmed!
  
        Booking Details:
        - Check-in Date: ${new Date(checkInDate).toLocaleDateString()}
        - Check-out Date: ${new Date(checkOutDate).toLocaleDateString()}
        - Room: ${room.number}, Floor: ${room.floor}, Price per night: $${
        room.price
      }
        ${
          coupon
            ? `- Coupon Applied: ${coupon.code} (${coupon.value}% off)`
            : ''
        }
        - Total Price: $${(totalAmount / 100).toFixed(2)} (after discount)
        - Payment Status: ${paymentStatus}
  
        We look forward to your stay!
  
        Best regards,
        Your Booking Team
      `,
    };

    await this.tansporter.sendMail(mailOptions);
  }
}
