'use client';

import { Alert } from 'flowbite-react';
import { useTranslations } from 'next-intl';
import { HiOutlineInformationCircle } from 'react-icons/hi2';

export default function SchoolNotActivated() {
  const t = useTranslations('dashboard.general');

  return (
    <>
      <Alert icon={HiOutlineInformationCircle} color="failure">
        {t('school_not_activated')}
      </Alert>
    </>
  );
}
