'use client';

import { Alert } from 'flowbite-react';
import { useTranslations } from 'next-intl';
import { HiOutlineInformationCircle } from 'react-icons/hi2';

export default function AlertMessage({ message, color }: { message: string; color?: string | 'failure' }) {
  const t = useTranslations('dashboard.general');

  return (
    <>
      <Alert icon={HiOutlineInformationCircle} color={color}>
        {t(message)}
      </Alert>
    </>
  );
}
