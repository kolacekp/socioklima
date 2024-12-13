'use client';

import { useTranslations } from 'next-intl';
import { Alert } from 'flowbite-react';
import { HiOutlineInformationCircle } from 'react-icons/hi2';

export default function ContentNotAllowed() {
  const t = useTranslations('error.error403');

  return (
    <Alert icon={HiOutlineInformationCircle} color="failure">
      {t('message')}
    </Alert>
  );
}
