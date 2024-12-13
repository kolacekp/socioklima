import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport, { Options } from 'nodemailer/lib/smtp-transport';
import newExpertCreatedEmail from '../templates/email/newExpertCreatedEmail';
import expertVerificationCompleteEmail from 'templates/email/expertVerificationCompleteEmail';
import newExpertPasswordEmail from '../templates/email/newExpertPasswordEmail';
import verificationLinkEmail from '../templates/email/verificationLinkEmail';
import schoolRegisteredEmailToPrincipal from '../templates/email/schoolRegisteredEmailToPrincipal';
import resetPasswordLinkEmail from '../templates/email/resetPasswordLinkEmail';
import schoolRegisteredEmailToManager from '../templates/email/schoolRegisteredEmailToManager';
import schoolRegisteredEmailToAdmin from '../templates/email/schoolRegisteredEmailToAdmin';
import schoolActivatedEmailToManager from '../templates/email/schoolActivatedEmailToManager';
import orderSuccessToPrincipal from 'templates/email/orderSuccessToPrincipal';
import orderSuccessToAdmin from 'templates/email/orderSuccessToAdmin';

export interface MailOptions {
  from?: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html: string;
}

export interface MailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export async function sendResetPasswordLinkEmail(
  emailTo: string,
  passwordResetToken: string,
  passwordResetValidTo: Date,
  locale: string
): Promise<SMTPTransport.SentMessageInfo> {
  const template = await resetPasswordLinkEmail(passwordResetToken, passwordResetValidTo, locale);

  const emailOptions = {
    to: emailTo,
    subject: template.subject,
    html: template.html,
    text: template.text
  } as MailOptions;

  return await sendEmail(emailOptions);
}

export async function sendNewExpertPasswordEmail(
  emailTo: string,
  passwordResetToken: string,
  passwordResetValidTo: Date,
  locale: string
): Promise<SMTPTransport.SentMessageInfo> {
  const template = await newExpertPasswordEmail(emailTo, passwordResetToken, passwordResetValidTo, locale);

  const emailOptions = {
    to: emailTo,
    subject: template.subject,
    html: template.html,
    text: template.text
  } as MailOptions;

  return await sendEmail(emailOptions);
}

export async function sendCreateNewExpertEmail(
  emailTo: string,
  expertId: string,
  schoolName: string,
  email: string,
  locale: string
): Promise<SMTPTransport.SentMessageInfo> {
  const template = await newExpertCreatedEmail(expertId, schoolName, email, locale);

  const emailOptions = {
    to: emailTo,
    subject: template.subject,
    html: template.html,
    text: template.text
  } as MailOptions;

  return await sendEmail(emailOptions);
}

export async function sendVerificationLinkEmail(
  emailTo: string,
  verificationToken: string,
  locale: string
): Promise<SMTPTransport.SentMessageInfo> {
  const template = await verificationLinkEmail(verificationToken, emailTo, locale);

  const emailOptions = {
    to: emailTo,
    subject: template.subject,
    text: template.text,
    html: template.html
  } as MailOptions;

  return await sendEmail(emailOptions);
}

export async function sendExpertVerificationCompleteEmail(
  emailTo: string,
  userName: string,
  locale: string
): Promise<SMTPTransport.SentMessageInfo> {
  const template = await expertVerificationCompleteEmail(userName, locale);

  const emailOptions = {
    to: emailTo,
    subject: template.subject,
    text: template.text,
    html: template.html
  } as MailOptions;

  return await sendEmail(emailOptions);
}

export async function sendSchoolRegisteredEmailToPrincipal(
  emailTo: string,
  schoolName: string,
  schoolBusinessId: string,
  locale: string,
  schoolCountry: string
): Promise<SMTPTransport.SentMessageInfo> {
  const template = await schoolRegisteredEmailToPrincipal(schoolName, schoolBusinessId, locale, schoolCountry);

  const emailOptions = {
    to: emailTo,
    subject: template.subject,
    text: template.text,
    html: template.html
  } as MailOptions;

  return await sendEmail(emailOptions);
}

export async function sendSchoolRegisteredEmailToManager(
  emailTo: string,
  schoolName: string,
  schoolBusinessId: string,
  locale: string
): Promise<SMTPTransport.SentMessageInfo> {
  const template = await schoolRegisteredEmailToManager(schoolName, schoolBusinessId, locale);

  const emailOptions = {
    to: emailTo,
    subject: template.subject,
    text: template.text,
    html: template.html
  } as MailOptions;

  return await sendEmail(emailOptions);
}

export async function sendSchoolRegisteredEmailToAdmin(
  emailTo: string,
  schoolId: string,
  schoolName: string,
  schoolBusinessId: string,
  locale: string
): Promise<SMTPTransport.SentMessageInfo> {
  const template = await schoolRegisteredEmailToAdmin(schoolId, schoolName, schoolBusinessId, locale);

  const emailOptions = {
    to: emailTo,
    subject: template.subject,
    text: template.text,
    html: template.html
  } as MailOptions;

  return await sendEmail(emailOptions);
}

export async function sendSchoolActivatedEmailToManager(
  emailTo: string,
  schoolName: string,
  schoolBusinessId: string,
  locale: string
): Promise<SMTPTransport.SentMessageInfo> {
  const template = await schoolActivatedEmailToManager(schoolName, schoolBusinessId, locale);

  const emailOptions = {
    to: emailTo,
    subject: template.subject,
    text: template.text,
    html: template.html
  } as MailOptions;

  return await sendEmail(emailOptions);
}

export async function sendOrderSuccessToPrincipal(
  emailTo: string,
  licenseId: string,
  product: number,
  price: number,
  country: number,
  locale: string
): Promise<SMTPTransport.SentMessageInfo> {
  const template = await orderSuccessToPrincipal(licenseId, product, price, country, locale);

  const emailOptions = {
    to: emailTo,
    subject: template.subject,
    text: template.text,
    html: template.html
  } as MailOptions;

  return await sendEmail(emailOptions);
}

export async function sendOrderSuccessToAdmin(
  emailTo: string,
  licenseId: string,
  product: number,
  price: number,
  country: number,
  schoolName: string,
  locale: string
): Promise<SMTPTransport.SentMessageInfo> {
  const template = await orderSuccessToAdmin(licenseId, product, price, country, schoolName, locale);

  const emailOptions = {
    to: emailTo,
    subject: template.subject,
    text: template.text,
    html: template.html
  } as MailOptions;

  return await sendEmail(emailOptions);
}

async function sendEmail(emailOptions: MailOptions): Promise<SMTPTransport.SentMessageInfo> {
  if (!process.env.SMTP_HOST) {
    return {} as SMTPTransport.SentMessageInfo;
  }

  const smtpOptions = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_TLS === 'yes',
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    }
  } as Options;

  const transporter = createTransport(smtpOptions);

  const options = {
    from: `${emailOptions.from || process.env.SMTP_SENDER}`,
    to: emailOptions.to,
    subject: emailOptions.subject,
    text: emailOptions.text,
    html: emailOptions.html
  } as Mail.Options;

  if (emailOptions.cc) {
    options.cc = emailOptions.cc;
  }

  if (emailOptions.bcc) {
    options.bcc = emailOptions.bcc;
  }

  return await transporter.sendMail(options);
}
