import { MailTemplate } from 'services/nodemailer.service';
import { getTranslations } from 'next-intl/server';
import emailTemplateBase from './templateBase';

const schoolRegisteredEmailToPrincipal = async (
  schoolName: string,
  schoolBusinessId: string,
  locale: string,
  schoolCountry: string
): Promise<MailTemplate> => {
  const t = await getTranslations({ locale, namespace: 'emails.school_registered_principal' });
  const tGeneral = await getTranslations({ locale, namespace: 'emails.general' });

  const gdprConsentContractUrl = `${process.env.APP_URL}/documents/SOCIOKLIMA_GDPR_consent_contract_${schoolCountry}.pdf`;

  const subject = t('subject');

  const text = `
      ${tGeneral('greeting')}\n\n
      ${t('on_website')} SOCIOKLIMA ${t('school_successfully_registered')} ${schoolName} (${t(
        'identification'
      )} ${schoolBusinessId}).\n\n
      ${t('we_add')} ${t('gdpr_consent_contract')}. ${t('please_sign')} info@socioklima.eu.\n\n
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
      ${t('we_add')} <strong><a href='${gdprConsentContractUrl}' target='_blank'>${t(
        'gdpr_consent_contract'
      )}</a></strong>. ${t('please_sign')} <a href="mailto:info@socioklima.eu">info@socioklima.eu</a>.
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

export default schoolRegisteredEmailToPrincipal;
