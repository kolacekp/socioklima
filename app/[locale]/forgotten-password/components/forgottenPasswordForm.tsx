'use client';

import Image from 'next/image';

import { Button } from 'flowbite-react';
import { Form, Formik, FormikProps } from 'formik';
import { useLocale, useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { HiOutlineEnvelope, HiOutlinePaperAirplane } from 'react-icons/hi2';
import * as Yup from 'yup';
import LanguageSwitcher from 'app/[locale]/dashboard/components/languageSwitcher';
import FormikTextInput from '@/app/components/inputs/formikTextInput';
import Link from 'next/link';
import { ErrorsEnum } from '@/utils/errors.enum';
import { ForgottenUserPasswordRequest } from '@/app/api/users/forgotten-password/route';
import { useRouter } from 'next/navigation';

interface ForgottenPasswordFormValues {
  email: string;
}

export default function ForgottenPasswordForm() {
  const locale = useLocale();
  const router = useRouter();

  const t = useTranslations('forgotten_password');
  const tAssets = useTranslations('assets');

  return (
    <>
      <div className="absolute top-4 right-2">
        <LanguageSwitcher />
      </div>
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

              <Formik
                initialValues={{
                  email: ''
                }}
                validationSchema={Yup.object({
                  email: Yup.string().email(t('email_is_in_bad_format')).required(t('email_is_required'))
                })}
                onSubmit={async (values, { setSubmitting }) => {
                  const response = await fetch('/api/users/forgotten-password', {
                    method: 'POST',
                    body: JSON.stringify({
                      email: values.email,
                      locale
                    } as ForgottenUserPasswordRequest)
                  });

                  if (response.ok) {
                    toast.success(t('email_sent'));
                    router.push('/login');
                  } else {
                    const res = await response.json();
                    if (res.code && res.code == ErrorsEnum.E_NO_EXISTING_EMAIL) {
                      toast.error(t('no_existing_email'));
                    } else {
                      toast.error(t('email_send_failure'));
                    }
                  }

                  setSubmitting(false);
                }}
              >
                {(props: FormikProps<ForgottenPasswordFormValues>) => (
                  <Form className="flex flex-col gap-4">
                    <div>
                      <p className="mb-3 whitespace-pre-line text-gray-500 dark:text-gray-400">{t('desc')}</p>
                    </div>

                    <div>
                      <FormikTextInput label={t('email')} name="email" autoComplete="false" icon={HiOutlineEnvelope} />
                    </div>

                    <div>
                      <Button
                        className="w-fit mx-auto"
                        disabled={!props.isValid || props.isSubmitting || !props.touched.email}
                        type="submit"
                        gradientDuoTone="purpleToBlue"
                        outline
                        pill
                        isProcessing={props.isSubmitting}
                      >
                        <p>{t('submit')}</p>
                        <HiOutlinePaperAirplane className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                    <div className="text-center">
                      <Link className="font-medium text-blue-700 dark:text-blue-500 hover:underline" href="/login">
                        {t('back_to_login')}
                      </Link>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
