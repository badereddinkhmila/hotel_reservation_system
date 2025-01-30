import { Logger } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const mailerProvider = [
  {
    provide: 'Mailer_Client',
    inject: [MailerService],
    useFactory: (
      mailerService: MailerService,
    ): Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options> => {
      const logger = new Logger('mailerProvider');
      try {
        logger.log('mailerProviders: useFactory: ');
        return mailerService.getMailerInstance();
      } catch (error) {
        logger.error('Unable to initialize nodemailer: ', error);
      }
    },
  },
];
