import { MailTemplate } from 'services/nodemailer.service';
import { getTranslations } from 'next-intl/server';
import emailTemplateBase from './templateBase';

const verificationLinkEmail = async (
  verificationToken: string,
  email: string,
  locale: string
): Promise<MailTemplate> => {
  const t = await getTranslations({ locale, namespace: 'emails.verification_link' });
  const tGeneral = await getTranslations({ locale, namespace: 'emails.general' });

  const verificationUrl = `${process.env.APP_URL}/${locale}/verification/user/${verificationToken}`;

  const subject = t('subject');

  const text = `
    ${tGeneral('greeting')}\n\n
    ${t('account_created')} SOCIOKLIMA.\n
    ${t('login')} ${email}\n
    ${t('verification_link')} ${verificationUrl}\n\n
    ${tGeneral('greeting_end')}\n
    ${tGeneral('milena')}\n\n
    ${tGeneral('company')}
  `;

  const html = emailTemplateBase(`
        <p>
          ${tGeneral('greeting')}<br><br>
          ${t('account_created')} <a href='${process.env.APP_URL}/${locale}' target='_blank'>SOCIOKLIMA</a>.<br>
          ${t('login')} <strong>${email}</strong><br>
          ${t('verification_link')} <a href='${verificationUrl}' target='_blank'>${verificationUrl}</a><br>
        </p>
        <p>
            ${tGeneral('greeting_end')}<br>
            ${tGeneral('milena')}<br>
            <br>
            ${tGeneral('company')}
        </p>
`);

  return {
    subject: subject,
    html: html,
    text: text
  } as MailTemplate;
};

export default verificationLinkEmail;
