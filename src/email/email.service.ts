import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendEmail(email: string, scheduledDate: Date) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your publication will be published soon',
      template: '/email',
      context: {
        scheduledDate,
      },
    });
  }
}
