import { Injectable, Logger } from '@nestjs/common';
import { readFile } from 'fs/promises';
import * as path from 'path';
import * as Handlebars from 'handlebars';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import mjml = require('mjml');

// types
export enum TemplateTypeEnum {
  emailConfirmation = 'email-confirmation',
}

export type EmailMetadata = {
  subject: string;
};

export abstract class EmailTemplate<T> {
  constructor(public context: T) {}
  public name: TemplateTypeEnum;
  get data(): T | unknown {
    return this.context;
  }
}

export interface BuiltTemplate {
  html: string;
  metadata: {
    subject: string;
  };
}

// service code
@Injectable()
export class TemplateService {
  private readonly logger: Logger = new Logger(TemplateService.name);

  async getTemplate<T>({
    name,
    data,
  }: EmailTemplate<T>): Promise<BuiltTemplate> {
    try {
      // pass the template name to produce html template
      const result = await this.getEmailTemplate(name);

      // compile handlebars template
      const template = Handlebars.compile<typeof data>(result.html);

      // build final output with data passed i.e eg : firstname, lastname, etc
      const html = template(data);

      // extract extra info (eg. subject) from the template
      const metadata = await this.getEmailData(name);

      return { html, metadata };
    } catch (error) {
      this.logger.error(`Error reading email template: ${error}`);
      throw new Error(error);
    }
  }

  async getEmailTemplate(
    templateName: TemplateTypeEnum,
  ): Promise<ReturnType<typeof mjml>> {
    try {
      const file = await readFile(
        path.resolve(
          __dirname,
          `../../templates/${templateName}/`,
          `${templateName}.mjml`,
        ),
        'utf8',
      );
      return mjml(file);
    } catch (error) {
      this.logger.error(
        `[getEmailTemplate]: Error reading email template: ${error}`,
      );
      throw new Error(error);
    }
  }

  async getEmailData(templateName: string): Promise<EmailMetadata> {
    try {
      const contents = await readFile(
        path.resolve(
          __dirname,
          `../../templates/${templateName}/`,
          `${templateName}.json`,
        ),
        'utf8',
      );
      return JSON.parse(contents);
    } catch (error) {
      this.logger.error(
        `[getEmailData]: Error reading email template: ${error}`,
      );
      throw new Error(error);
    }
  }
}
