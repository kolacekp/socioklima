'use client';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from 'flowbite-react';
import { HiOutlinePaperAirplane } from 'react-icons/hi2';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ForgottenUserPasswordRequest } from '@/app/api/users/forgotten-password/route';
import { useRouter } from 'next/navigation';

export default function InvalidToken({ email }: { email: string }) {
  const t = useTranslations('invalid_token');
  const tAssets = useTranslations('assets');
  const [processing, setProcessing] = useState<boolean>(false);
  const locale = useLocale();
  const router = useRouter();

  async function sendNewPasswordResetRequest(email: string): Promise<void> {
    setProcessing(true);
    const response = await fetch('/api/users/forgotten-password', {
      method: 'POST',
      body: JSON.stringify({
        email,
        locale
      } as ForgottenUserPasswordRequest)
    });

    if (response.ok) {
      toast.success(t('email_sent'));
      router.push('/login');
    } else {
      toast.error(t('email_send_failure'));
    }
    setProcessing(false);
  }

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

            <div>
              <p className="my-3 whitespace-pre-line text-gray-500 dark:text-gray-400">{t('desc')}</p>
            </div>

            <div>
              <Button
                className="w-fit mx-auto"
                gradientDuoTone="purpleToBlue"
                outline
                pill
                isProcessing={processing}
                onClick={() => sendNewPasswordResetRequest(email)}
              >
                <p>{t('send_new')}</p>
                <HiOutlinePaperAirplane className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
