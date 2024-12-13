import LoginForm from './components/loginForm';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'login' });

  return {
    title: `SOCIOKLIMA | ${t('login')}`
  };
}

export default function LoginPage() {
  return <LoginForm />;
}
