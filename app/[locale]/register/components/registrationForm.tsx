'use client';

import FormikTextInput from '@/app/components/inputs/formikTextInput';
import LanguageSwitcher from 'app/[locale]/dashboard/components/languageSwitcher';
import { Alert, Button, Label, Tooltip } from 'flowbite-react';
import { Form, Formik, FormikProps } from 'formik';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  HiOutlineArrowLeftOnRectangle,
  HiOutlineEnvelope,
  HiOutlineEye,
  HiOutlineKey,
  HiOutlineUser,
  HiOutlineUserPlus,
  HiOutlineInformationCircle
} from 'react-icons/hi2';
import * as Yup from 'yup';
import { UserCreateRequest } from '@/app/api/users/create/route';
import { useState } from 'react';
import { HiOutlineEyeOff } from 'react-icons/hi';

export default function RegistrationForm() {
  const t = useTranslations('register');
  const tGeneral = useTranslations('general');
  const tAssets = useTranslations('assets');
  const router = useRouter();
  const locale = useLocale();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  async function createUser(name: string, email: string, password: string): Promise<void> {
    const res = await fetch('/api/users/create', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        locale,
        verificationRequired: true
      } as UserCreateRequest)
    });

    const body = (await res.json()) as { isCreated: boolean };

    if (res.status == 200 && body.isCreated) {
      toast.success(t('user_created'));
      router.push('/login');
    } else {
      toast.error(t('user_create_failure'));
    }
  }

  // @ts-ignore
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
                {t('registration')}
              </h1>

              <Alert color="success" icon={HiOutlineInformationCircle}>
                <span>
                  <p>{t('info_alert')}</p>
                </span>
              </Alert>

              <Formik
                initialValues={{
                  email: '',
                  name: '',
                  password: '',
                  confirm: ''
                }}
                validationSchema={Yup.object({
                  email: Yup.string().email(t('email_is_not_valid')).required(t('email_is_required')),
                  name: Yup.string().max(100, t('name_max_100_chars')).required(t('name_is_required')),
                  password: Yup.string()
                    .required(t('pwd_is_required'))
                    .min(8, t('pwd_min_8_chars'))
                    .matches(/[0-9]/, t('pwd_one_digit'))
                    .matches(/[A-Z]/, t('pwd_one_uppercase_letter')),
                  confirm: Yup.string()
                    .required(t('confirm_password_input'))
                    .oneOf([Yup.ref('password')], t('passwords_no_match'))
                })}
                onSubmit={async (values, { setSubmitting }) => {
                  // step 1 - verify that email is not used
                  const res = await fetch(
                    '/api/users/email?' +
                      new URLSearchParams({
                        email: values.email
                      }),
                    {
                      method: 'GET'
                    }
                  );

                  const result = await res.json();
                  if (result) {
                    toast.error(t('email_already_exists'));
                  } else {
                    await createUser(values.name, values.email, values.password);
                  }

                  setSubmitting(false);
                }}
              >
                {(props: FormikProps<any>) => (
                  <Form>
                    <div className="flex flex-col gap-4">
                      <div>
                        <FormikTextInput
                          label={t('email')}
                          name="email"
                          type="email"
                          autoComplete="false"
                          icon={HiOutlineEnvelope}
                        />
                      </div>
                      <div>
                        <FormikTextInput label={t('name')} name="name" type="text" icon={HiOutlineUser} />
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
                            ></FormikTextInput>
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
                      <div>
                        <Label className="mb-2 block" htmlFor="confirm">
                          {t('confirm_password')}
                        </Label>
                        <div className="flex flex-row gap-2">
                          <div className="grow">
                            <FormikTextInput
                              name="confirm"
                              type={showPasswordConfirm ? 'text' : 'password'}
                              icon={HiOutlineKey}
                            ></FormikTextInput>
                          </div>
                          <div className="flex flex-col justify-start">
                            <Tooltip
                              content={showPasswordConfirm ? tGeneral('hide_password') : tGeneral('show_password')}
                            >
                              <Button
                                className="w-fit"
                                gradientDuoTone="purpleToBlue"
                                outline
                                pill
                                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                              >
                                {showPasswordConfirm && <HiOutlineEyeOff className="h-5 w-5" />}
                                {!showPasswordConfirm && <HiOutlineEye className="h-5 w-5" />}
                              </Button>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Button
                            disabled={!props.isValid || props.isSubmitting}
                            type="submit"
                            gradientDuoTone="purpleToBlue"
                            outline
                            pill
                            className="w-full"
                            isProcessing={props.isSubmitting}
                          >
                            <p>{t('sign_up')}</p>
                            <HiOutlineUserPlus className="ml-2 h-5 w-5" />
                          </Button>
                        </div>
                        <div>
                          <Button
                            gradientDuoTone="purpleToBlue"
                            pill
                            className="w-full"
                            onClick={() => router.push('/login')}
                          >
                            <p>{t('sign_in')}</p>
                            <HiOutlineArrowLeftOnRectangle className="ml-2 h-5 w-5" />
                          </Button>
                        </div>
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
