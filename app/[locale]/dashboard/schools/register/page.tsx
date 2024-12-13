import SchoolRegistrationForm from './components/schoolRegistrationForm';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'dashboard.school.register' });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

export default function RegisterSchoolPage() {
  return <SchoolRegistrationForm />;
}
