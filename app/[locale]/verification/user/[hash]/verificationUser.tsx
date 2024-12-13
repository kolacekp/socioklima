'use client';

import { UserInfo } from 'models/user-info';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function VerificationUser({ user }: { user: UserInfo }) {
  const t = useTranslations('verification');
  const tAssets = useTranslations('assets');

  return (
    <section className="bg-gray-50">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-8">
            <div className="relative h-20 w-full">
              <Image
                className="object-contain"
                src={`/images/${tAssets('logo')}`}
                alt="Logo"
                fill={true}
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={true}
              />
            </div>

            <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              {t('heading')}
            </h1>
            <div className="text-center">{user?.email ? t('is_verified') : t('is_not_verified')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
