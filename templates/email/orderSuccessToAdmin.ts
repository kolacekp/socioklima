import { MailTemplate } from 'services/nodemailer.service';
import { getTranslations } from 'next-intl/server';
import emailTemplateBase from './templateBase';

const orderSuccessToAdmin = async (
  licenseId: string,
  product: number,
  price: number,
  country: number,
  schoolName: string,
  locale: string
): Promise<MailTemplate> => {
  const t = await getTranslations({ locale, namespace: 'emails.order_success_admin' });
  const tGeneral = await getTranslations({ locale, namespace: 'emails.general' });

  const subject = t('subject');

  const url = `${process.env.APP_URL}/${locale}/documents/invoice/${licenseId}`;

  const text = `
      ${tGeneral('greeting')}\n\n
      ${t('school')} ${schoolName} ${t('order_successful')} SOCIOKLIMA ${t('invoice')} ${t('product.' + product)} ${t(
        'price'
      )} ${price} ${t('currency.' + country)}.\n\n
      ${t('invoice_url')} ${url}\n\n
      ${tGeneral('greeting_end')}\n
      ${tGeneral('milena')}\n\n
      ${tGeneral('company')}
  `;

  const html = emailTemplateBase(`
    <p>
      ${tGeneral('greeting')}<br><br>
      ${t('school')} ${schoolName} ${t('order_successful')} <a href='${
        process.env.APP_URL
      }/${locale}' target='_blank'>SOCIOKLIMA</a> ${t('invoice')} ${t('product.' + product)} ${t('price')} ${price} ${t(
        'currency.' + country
      )}.
    </p>
    <p>
      ${t('invoice_url')} <a href='${url}' target='_blank'>${url}</a>
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

export default orderSuccessToAdmin;
