import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EMAIL_USER, MAIL_PASSWORD } from './constants/mail';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: MAIL_PASSWORD, 
      },

    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: EMAIL_USER,
      to,
      subject,
      text,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
