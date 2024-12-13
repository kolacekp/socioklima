import { MailTemplate } from 'services/nodemailer.service';
import { getTranslations } from 'next-intl/server';
import emailTemplateBase from './templateBase';

const expertVerificationCompleteEmail = async (userName: string, locale: string): Promise<MailTemplate> => {
  const t = await getTranslations({ locale, namespace: 'emails.expert_verification_complete' });
  const tGeneral = await getTranslations({ locale, namespace: 'emails.general' });

  const subject = t('subject');

  const text = `
      ${tGeneral('greeting')}\n\n
      ${t('in_system')} SOCIOKLIMA ${t('expert_verified')}\n
      ${t('login')} ${userName}\n
      ${t('now_you_can')} ${t('log_in')} ${t('to_system')}\n\n
      ${tGeneral('greeting_end')}\n
      ${tGeneral('milena')}\n\n
      ${tGeneral('company')}
  `;

  const html = emailTemplateBase(`
    <p>
      ${tGeneral('greeting')}<br><br>
      ${t('in_system')} <a href='${process.env.APP_URL}/${locale}' target='_blank'>SOCIOKLIMA</a> ${t(
        'expert_verified'
      )}<br>
      ${t('login')} <strong>${userName}</strong><br>
      ${t('now_you_can')} <a href='${process.env.APP_URL}/${locale}/login' target='_blank'>${t('log_in')}</a> ${t(
        'to_system'
      )}
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

export default expertVerificationCompleteEmail;
