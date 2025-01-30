import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
@Injectable()
export class MailerService {
  private readonly logger: Logger = new Logger(MailerService.name);
  mailerClient: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;
  constructor(private configService: ConfigService) {}

  getMailerInstance = (): Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  > => {
    const transportOptions: SMTPTransport.Options = {
      service: this.configService.get<string>('mailer.service'),
      host: this.configService.get<string>('mailer.host'),
      port: this.configService.get<number>('mailer.port'),
      secure: this.configService.get<boolean>('mailer.secure'),
      auth: {
        user: this.configService.get<string>('mailer.auth.user'),
        pass: this.configService.get<string>('mailer.auth.pass'),
      },
    };
    try {
      return (this.mailerClient = createTransport(transportOptions));
    } catch (error: any) {
      this.logger.error(error);
    }
  };
}
