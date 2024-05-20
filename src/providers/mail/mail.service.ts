import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable() 
class MailService {
  constructor(
    private mailerService: MailerService,
  ) {}

  public sendPasswordMail = async (email: string, otp: string) => {

    await this.mailerService.sendMail({
      to: email,
      subject: "Password Reset!!",
      template: './forget',
      context: {
        otp
      }
    })
  }
}

export default MailService;
