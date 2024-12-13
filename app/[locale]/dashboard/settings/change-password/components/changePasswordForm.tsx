'use client';

import FormikTextInput from 'app/components/inputs/formikTextInput';
import { Button } from 'flowbite-react';
import { Form, Formik, FormikProps } from 'formik';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { HiOutlineKey } from 'react-icons/hi2';
import * as Yup from 'yup';
import { ChangeUserPasswordRequest } from '@/app/api/users/change-password/route';
import { ErrorsEnum } from '@/utils/errors.enum';

interface PasswordChangeFormValues {
  old: string;
  new: string;
  confirm: string;
  userId: string;
}

export default function ChangePasswordForm({ userId }: { userId: string }) {
  const t = useTranslations('dashboard.settings.change_password');

  return (
    <>
      <div className="mx-auto max-w-xl rounded-t-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
        <span className="text-gray-800 dark:text-white">{t('heading')}</span>
      </div>
      <div
        className="mx-auto max-w-xl rounded-b-xl border-x border-b border-gray-200 bg-white bg-gradient-to-r p-0 dark:border-gray-600
       dark:bg-gray-900"
      >
        <div className="mx-auto w-full rounded-b-xl bg-white bg-gradient-to-r p-2 dark:bg-gray-900 sm:p-6">
          <Formik
            initialValues={{
              old: '',
              new: '',
              confirm: '',
              userId: userId
            }}
            validationSchema={Yup.object({
              old: Yup.string().required(t('old_pwd_is_required')),
              new: Yup.string()
                .required(t('new_pwd_is_required'))
                .min(8, t('new_pwd_min_8_chars'))
                .matches(/[0-9]/, t('new_pwd_one_digit'))
                .matches(/[A-Z]/, t('new_pwd_one_uppercase_letter')),
              confirm: Yup.string()
                .required(t('confirm_password_input'))
                .oneOf([Yup.ref('new')], t('passwords_no_match'))
            })}
            onSubmit={async (values, { setSubmitting }) => {
              const response = await fetch('/api/users/change-password', {
                method: 'POST',
                body: JSON.stringify({
                  userId: values.userId,
                  old: values.old,
                  new: values.new
                } as ChangeUserPasswordRequest)
              });

              if (response.ok) {
                toast.success(t('password_changed'));
              } else {
                const res = await response.json();
                if (res.code && res.code == ErrorsEnum.E_BAD_PASSWORD) {
                  toast.error(t('bad_password'));
                } else {
                  toast.error(t('password_change_failure'));
                }
              }

              setSubmitting(false);
            }}
          >
            {(props: FormikProps<PasswordChangeFormValues>) => (
              <Form className="flex flex-col gap-4">
                <div>
                  <FormikTextInput type="password" label={t('old_password')} name="old" />
                </div>

                <div>
                  <FormikTextInput type="password" label={t('new_password')} name="new" />
                </div>

                <div>
                  <FormikTextInput type="password" label={t('confirm_password')} name="confirm" />
                </div>

                <Button
                  disabled={!props.isValid || props.isSubmitting || !props.touched.old}
                  type="submit"
                  className="mt-4 w-full"
                  gradientDuoTone="purpleToBlue"
                  outline
                  pill
                  isProcessing={props.isSubmitting}
                >
                  <p>{t('change')}</p>
                  <HiOutlineKey className="ml-2 h-5 w-5" />
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
