import { prisma } from '@/lib/prisma';
import ContentNotAllowed from '../../../dashboard/components/contentNotAllowed';
import { pick } from 'lodash';
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';

const LicenseInvoice = dynamic(() => import('../licenseInvoice'), {
  ssr: false
});

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'documents.invoice' });

  return {
    title: t('title')
  };
}

export default async function InvoicePdf({ params }: { params: { id: string } }) {
  const license = await prisma.license.findFirst({
    where: { id: params.id },
    include: {
      school: true
    }
  });

  if (!license || !license.generateInvoice) return <ContentNotAllowed />;

  const messages = (await import(`messages/${license.school.country === 1 ? 'sk' : 'cs'}.json`))
    .default as AbstractIntlMessages;

  return (
    <NextIntlClientProvider
      locale={license.school.country === 1 ? 'sk' : 'cs'}
      messages={pick(messages, 'documents.invoice')}
    >
      <LicenseInvoice license={license} />
    </NextIntlClientProvider>
  );
}
