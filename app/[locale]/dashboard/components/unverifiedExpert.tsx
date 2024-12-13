'use client';

import { Alert } from 'flowbite-react';
import { useTranslations } from 'next-intl';
import { HiOutlineInformationCircle } from 'react-icons/hi2';

export default function UnverifiedExpert() {
  const t = useTranslations('dashboard.general');

  return (
    <>
      <Alert icon={HiOutlineInformationCircle} color="failure">
        {t('unverified_expert')}
      </Alert>
    </>
  );
}
