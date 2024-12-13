'use client';

import { useTranslations } from 'next-intl';
import { Alert } from 'flowbite-react';
import { HiOutlineInformationCircle } from 'react-icons/hi2';

export default function NoResultsAlert() {
  const t = useTranslations('error.no_results');

  return (
    <Alert icon={HiOutlineInformationCircle} color="failure" className="m-4">
      {t('message')}
    </Alert>
  );
}
