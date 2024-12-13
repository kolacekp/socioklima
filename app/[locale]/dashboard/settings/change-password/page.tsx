import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ContentNotAllowed from '../../components/contentNotAllowed';
import { getTranslations } from 'next-intl/server';
import ChangePasswordForm from './components/changePasswordForm';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'dashboard.settings.change_password' });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

export default async function ChangePasswordPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) return <ContentNotAllowed />;

  return <ChangePasswordForm userId={session.user.id} />;
}
