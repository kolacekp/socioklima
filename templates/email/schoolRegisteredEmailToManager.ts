import { MailTemplate } from 'services/nodemailer.service';
import { getTranslations } from 'next-intl/server';
import emailTemplateBase from './templateBase';

const schoolRegisteredEmailToManager = async (
  schoolName: string,
  schoolBusinessId: string,
  locale: string
): Promise<MailTemplate> => {
  const t = await getTranslations({ locale, namespace: 'emails.school_registered_manager' });
  const tGeneral = await getTranslations({ locale, namespace: 'emails.general' });

  const subject = t('subject');

  const text = `
      ${tGeneral('greeting')}\n\n
      ${t('on_website')} SOCIOKLIMA ${t('school_successfully_registered')} ${schoolName} (${t(
        'identification'
      )} ${schoolBusinessId}).\n\n
      ${tGeneral('greeting_end')}\n
      ${tGeneral('milena')}\n\n
      ${tGeneral('company')}
  `;

  const html = emailTemplateBase(`
    <p>
      ${tGeneral('greeting')}<br><br>
      ${t('on_website')} <a href='${process.env.APP_URL}/${locale}' target='_blank'>SOCIOKLIMA</a> ${t(
        'school_successfully_registered'
      )} ${schoolName} (${t('identification')} ${schoolBusinessId}).
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

export default schoolRegisteredEmailToManager;
