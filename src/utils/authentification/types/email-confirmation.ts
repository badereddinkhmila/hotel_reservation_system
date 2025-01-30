import {
  EmailTemplate,
  TemplateTypeEnum,
} from 'src/utils/mailer/template.service';

export class EmailConfirmation extends EmailTemplate<{
  firstname: string;
  lastname: string;
  companyname: string;
  contactemail: string;
  hash: string;
}> {
  name = TemplateTypeEnum.emailConfirmation;
}
