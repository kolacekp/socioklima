import RegistrationForm from './components/registrationForm';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'register' });

  return {
    title: `SOCIOKLIMA | ${t('registration')}`
  };
}

export default function RegistrationPage() {
  return <RegistrationForm />;
}
