import { MailTemplate } from 'services/nodemailer.service';
import { getTranslations } from 'next-intl/server';
import emailTemplateBase from './templateBase';

const newExpertCreatedEmail = async (
  expertId: string,
  schoolName: string,
  email: string,
  locale: string
): Promise<MailTemplate> => {
  const t = await getTranslations({ locale, namespace: 'emails.new_expert_created' });
  const tGeneral = await getTranslations({ locale, namespace: 'emails.general' });

  const subject = t('subject');

  const text = `${tGeneral('greeting')}\n\n
          ${t('expert_created')} ${email}\n
          ${t('school')} ${schoolName}\n\n
          ${tGeneral('company')}`;

  const html = emailTemplateBase(
    `
              <p>
              ${tGeneral('greeting')}<br><br>
              ${t('expert_created')} <strong>${email}</strong><br>
              ${t('school')} ${schoolName}
              </p>
              <p>
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

export default newExpertCreatedEmail;
