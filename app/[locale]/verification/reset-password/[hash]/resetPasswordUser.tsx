'use client';

import { Form, Formik, FormikProps } from 'formik';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Button } from 'flowbite-react';
import FormikTextInput from '@/app/components/inputs/formikTextInput';
import { HiOutlineCheckCircle, HiOutlineKey } from 'react-icons/hi2';

export default function ResetPasswordUser({ passwordResetToken }: { passwordResetToken: string }) {
  const t = useTranslations('register');
  const tPass = useTranslations('reset_password');
  const tAssets = useTranslations('assets');

  const router = useRouter();

  async function resetPassword(passwordResetToken: string, password: string): Promise<void> {
    const res = await fetch('/api/users/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        passwordResetToken,
        password
      })
    });

    const body = (await res.json()) as { isCreated: boolean };

    if (res.status == 200 && body?.isCreated) {
      toast.success(tPass('reset_password'));
      router.push('/login');
    } else {
      toast.error(tPass('reset_password_failure'));
    }
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
              {tPass('heading')}
            </h1>

            <Formik
              initialValues={{
                password: '',
                confirm: ''
              }}
              validationSchema={Yup.object({
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
                await resetPassword(passwordResetToken, values.password);

                setSubmitting(false);
              }}
            >
              {(props: FormikProps<any>) => (
                <Form className="flex flex-col gap-4">
                  <div>
                    <FormikTextInput label={t('password')} name="password" type="password" icon={HiOutlineKey} />
                  </div>

                  <div>
                    <FormikTextInput label={t('confirm_password')} name="confirm" type="password" icon={HiOutlineKey} />
                  </div>

                  <div>
                    <Button
                      disabled={!props.isValid}
                      type="submit"
                      className="w-fit mx-auto"
                      outline
                      pill
                      isProcessing={props.isSubmitting}
                      gradientDuoTone="purpleToBlue"
                    >
                      {tPass('submit')}
                      <HiOutlineCheckCircle className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
}
