'use client';

import { Alert } from 'flowbite-react';
import { useTranslations } from 'next-intl';
import { HiOutlineInformationCircle } from 'react-icons/hi2';

export default function NoLicense() {
  const t = useTranslations('dashboard.general');

  return (
    <>
      <Alert icon={HiOutlineInformationCircle} color="failure">
        {t('no_license')}
      </Alert>
    </>
  );
}
