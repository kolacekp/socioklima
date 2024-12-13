import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import IndexContent from './indexContent';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'dashboard.index_page' });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

export default function IndexPage() {
  const session = getServerSession(authOptions);

  if (!session) {
    redirect('/error/403');
  }

  return <IndexContent />;
}
