import { MailTemplate } from 'services/nodemailer.service';
import { getTranslations } from 'next-intl/server';
import emailTemplateBase from './templateBase';

const resetPasswordLinkEmail = async (
  passwordResetToken: string,
  passwordResetTokenValidTo: Date,
  locale: string
): Promise<MailTemplate> => {
  const t = await getTranslations({ locale, namespace: 'emails.reset_password_link' });
  const tGeneral = await getTranslations({ locale, namespace: 'emails.general' });

  const url = `${process.env.APP_URL}/${locale}/verification/reset-password/${passwordResetToken}`;

  const formattedValidityDate =
    passwordResetTokenValidTo.toLocaleDateString('cs', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) ?? '';

  const subject = t('subject');

  const text = ` ${tGeneral('greeting')}\n\n
    ${t('reset_password_requested')} SOCIOKLIMA\n
    ${t('reset_password_link')} ${url} \n         
    ${t('reset_link_valid_to')} ${formattedValidityDate} \n\n
    ${tGeneral('greeting_end')}\n
    ${tGeneral('milena')}\n\n
    ${tGeneral('company')}
  `;

  const html = emailTemplateBase(
    `
            <p>
              ${tGeneral('greeting')}<br><br>
              ${t('reset_password_requested')} <a href='${
                process.env.APP_URL
              }/${locale}' target='_blank'>SOCIOKLIMA</a>.<br>
              ${t('reset_password_link')} <a href='${url}' target='_blank'>${url}</a><br>
              ${t('reset_link_valid_to')} ${formattedValidityDate}
            </p>
            <p>
              ${tGeneral('greeting_end')}<br>
              ${tGeneral('milena')}<br>
              <br>
              ${tGeneral('company')}
            </p>
          `
  );

  return {
    subject: subject,
    html: html,
    text: text
  } as MailTemplate;
};

export default resetPasswordLinkEmail;
