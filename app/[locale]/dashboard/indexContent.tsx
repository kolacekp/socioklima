'use client';

import { useTranslations } from 'next-intl';
import { Button } from 'flowbite-react';
import { HiOutlineArrowRightCircle } from 'react-icons/hi2';

export default function IndexContent() {
  const t = useTranslations('dashboard.index_page');

  return (
    <div className="grid gric-cols-1 gap-4 my-4">
      <h1 className="px-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-2xl dark:text-white">
        {t('heading')}
      </h1>
      <p className="px-4 text-md font-normal text-gray-500 lg:text-lg dark:text-gray-400">{t('desc')}</p>
      <Button outline pill gradientDuoTone="purpleToBlue" className="mx-4 w-fit" onClick={() => window.open(t('link'))}>
        <p>{t('link_text')}</p>
        <HiOutlineArrowRightCircle className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}
