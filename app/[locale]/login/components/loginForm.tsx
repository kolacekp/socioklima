'use client';

import Image from 'next/image';

import { Alert, Button, Label, Tooltip } from 'flowbite-react';
import { Form, Formik, FormikProps } from 'formik';
import { SignInResponse, signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  HiOutlineArrowRight,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineEnvelope,
  HiOutlineKey,
  HiOutlineUser,
  HiOutlineInformationCircle,
  HiOutlineEye
} from 'react-icons/hi2';
import * as Yup from 'yup';
import LanguageSwitcher from 'app/[locale]/dashboard/components/languageSwitcher';
import FormikTextInput from '@/app/components/inputs/formikTextInput';
import Link from 'next/link';
import { useState } from 'react';
import { HiOutlineEyeOff } from 'react-icons/hi';

export default function LoginForm() {
  const router = useRouter();

  const t = useTranslations('login');
  const tGeneral = useTranslations('general');
  const tAssets = useTranslations('assets');
  const [showPassword, setShowPassword] = useState(false);

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
                {t('login')}
              </h1>

              <Alert color="success" icon={HiOutlineInformationCircle}>
                <span>
                  <p>
                    {t('info_start')}{' '}
                    <Link className="font-bold" target="_blank" href={t('info_link')}>
                      {t('info_here')}.
                    </Link>{' '}
                    {t('info_end')}
                  </p>
                </span>
              </Alert>

              <Formik
                initialValues={{
                  usernameOrEmail: '',
                  password: ''
                }}
                validationSchema={Yup.object({
                  usernameOrEmail: Yup.string().required(t('username_or_email_is_required')),
                  password: Yup.string().required(t('pwd_is_required'))
                })}
                onSubmit={async (values, { setSubmitting }) => {
                  await signIn('credentials', {
                    redirect: false,
                    usernameOrEmail: values.usernameOrEmail,
                    password: values.password
                  }).then((res: SignInResponse | undefined) => {
                    if (!res) {
                      toast.error(t('login_error'));
                      return;
                    }

                    if (res.ok) {
                      const url = new URL(location.href);
                      const callbackUrl = url.searchParams.get('callbackUrl');
                      router.push(callbackUrl ?? '/dashboard');
                    } else {
                      toast.error(res.error ? t(res.error) : '');
                    }
                  });

                  setSubmitting(false);
                }}
              >
                {(props: FormikProps<any>) => (
                  <Form>
                    <div className="flex flex-col gap-4">
                      <div>
                        <FormikTextInput
                          label={t('username_email')}
                          name="usernameOrEmail"
                          icon={HiOutlineEnvelope}
                          rightIcon={HiOutlineUser}
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block" htmlFor="password">
                          {t('password')}
                        </Label>
                        <div className="flex flex-row gap-2">
                          <div className="grow">
                            <FormikTextInput
                              name="password"
                              type={showPassword ? 'text' : 'password'}
                              icon={HiOutlineKey}
                            />
                          </div>
                          <div className="flex flex-col justify-start">
                            <Tooltip content={showPassword ? tGeneral('hide_password') : tGeneral('show_password')}>
                              <Button
                                className="w-fit"
                                gradientDuoTone="purpleToBlue"
                                outline
                                pill
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword && <HiOutlineEyeOff className="h-5 w-5" />}
                                {!showPassword && <HiOutlineEye className="h-5 w-5" />}
                              </Button>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Button
                            className="w-full"
                            disabled={!props.isValid || props.isSubmitting}
                            type="submit"
                            gradientDuoTone="purpleToBlue"
                            outline
                            pill
                            isProcessing={props.isSubmitting}
                          >
                            <p>{t('sign_in')}</p>
                            <HiOutlineArrowLeftOnRectangle className="ml-2 h-5 w-5" />
                          </Button>
                        </div>
                        <div>
                          <Button
                            className="w-full"
                            gradientDuoTone="purpleToBlue"
                            pill
                            onClick={() => router.push('/register')}
                          >
                            <p>{t('no_acc_register')}</p>
                            <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-center">
                        <Link
                          className="font-medium text-blue-700 dark:text-blue-500 hover:underline"
                          href="/forgotten-password"
                        >
                          {t('forgotten_password')}
                        </Link>
                      </div>
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
