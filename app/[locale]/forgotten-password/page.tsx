import { getTranslations } from 'next-intl/server';
import ForgottenPasswordForm from './components/forgottenPasswordForm';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'forgotten_password' });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}
export default function ForgottenPasswordPage() {
  return <ForgottenPasswordForm />;
}
