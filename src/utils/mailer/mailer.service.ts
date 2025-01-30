import { Inject, Injectable, Logger } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { EmailTemplate, TemplateService } from './template.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private logger: Logger = new Logger(MailerService.name);
  constructor(
    @Inject('Mailer_Client')
    private mailerClient: Transporter<
      SMTPTransport.SentMessageInfo,
      SMTPTransport.Options
    >,
    @Inject() private templateService: TemplateService,
    private configService: ConfigService,
  ) {}

  async sendEmail(): Promise<void> {
    try {
      await this.mailerClient.sendMail({
        from: 'bbbadrouch@gmail.com',
        to: 'khmila.badreddin@gmail.com',
        subject: 'Hello from Nodemailer',
        text: 'My nest application mailer test.',
      } as Mail.Options);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async sendEmailFromTemplate<T>(
    template: EmailTemplate<T>,
    options: Mail.Options,
  ) {
    try {
      if (!options.to || (Array.isArray(options.to) && !options.to?.length)) {
        throw new Error('No recipient found');
      }

      const { html, metadata } =
        await this.templateService.getTemplate(template);

      return this.mailerClient.sendMail({
        to: options.to,
        from:
          options.from ?? this.configService.get<string>('mailer.auth.user'),
        subject: metadata.subject,
        html,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
