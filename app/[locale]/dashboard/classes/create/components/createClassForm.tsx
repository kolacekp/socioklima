'use client';

import { License } from '@prisma/client';
import FormikTextInput from 'app/components/inputs/formikTextInput';
import { Button, Label, ToggleSwitch } from 'flowbite-react';
import { Form, Formik, FormikProps } from 'formik';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePlusCircle } from 'react-icons/hi2';
import * as Yup from 'yup';

export interface ClassFormValues {
  name: string;
  grade: string;
  licenseId: string;
  schoolId: string;
  genderRequired: boolean;
}

export default function CreateClassForm({ licenses, schoolId }: { licenses: License[]; schoolId: string }) {
  const t = useTranslations('dashboard.classes.create');
  const tLists = useTranslations('lists');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGenderRequiredChange = async (value: boolean, props: FormikProps<ClassFormValues>) => {
    await props.setFieldValue('genderRequired', value);
  };

  return (
    <>
      <div
        className="text-gray-300 cursor-pointer hover:text-gray-400 text-sm w-fit"
        onClick={() => router.push('/dashboard/classes/list')}
      >
        ← {t('back')}
      </div>
      <div className="shadow-md mx-auto max-w-xl rounded-t-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
        <span className="text-gray-800 dark:text-white">{t('heading')}</span>
      </div>
      <div className="shadow-md mx-auto max-w-xl rounded-b-xl border-x border-b border-gray-200 bg-white bg-gradient-to-r p-0 dark:border-gray-600 dark:bg-gray-900">
        <div className="mx-auto w-full rounded-b-xl bg-white bg-gradient-to-r p-2 dark:bg-gray-900 sm:p-6">
          <Formik
            validateOnMount
            initialValues={{
              name: '',
              grade: '0',
              licenseId: licenses[0].id.toString(),
              schoolId: schoolId,
              genderRequired: false
            }}
            validationSchema={Yup.object({
              name: Yup.string().required(t('required'))
            })}
            onSubmit={async (values) => {
              setIsLoading(true);
              const response = await fetch('/api/classes/create', {
                method: 'POST',
                body: JSON.stringify(values)
              });

              if (response.ok) {
                toast.success(t('toast_success'));
                setTimeout(() => {
                  window.location.href = '/dashboard/classes/list/';
                }, 1000);
              } else {
                toast.error(t('toast_failure'));
              }
              setIsLoading(false);
            }}
          >
            {(props: FormikProps<ClassFormValues>) => (
              <Form className="flex flex-col gap-4">
                <div>
                  <FormikTextInput label={t('name')} name="name" />
                </div>

                <div>
                  <Label htmlFor="grades" value={t('grade')} className="mb-2 block" />
                  <select
                    id="grades"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    {...props.getFieldProps('grade')}
                    value={props.values.grade}
                    onChange={props.handleChange}
                  >
                    {[...Array(15)].map((e, i) => {
                      return (
                        <option value={i} key={i}>
                          {tLists('grades.' + i)}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <Label htmlFor="licenses" value={t('license')} className="mb-2 block" />
                  <select
                    id="licenses"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    {...props.getFieldProps('licenseId')}
                    value={props.values.licenseId}
                    onChange={props.handleChange}
                  >
                    {licenses.map((license) => (
                      <option value={license.id} key={license.id}>
                        {`${tLists('products.' + license.product)} | ${t(
                          'valid_from'
                        )} ${license.validFrom.toLocaleDateString('cs-CZ')} ${t(
                          'valid_until'
                        )} ${license.validUntil.toLocaleDateString('cs-CZ')} | ${t('remaining')} ${
                          license.classesRemaining
                        } ${t('classes')}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="my-2">
                  <ToggleSwitch
                    color="purple"
                    label={t('gender_required')}
                    checked={props.values.genderRequired}
                    onChange={(value) => handleGenderRequiredChange(value, props)}
                  />
                </div>

                <Button
                  type="submit"
                  isProcessing={isLoading}
                  disabled={!props.isValid || props.isSubmitting}
                  outline
                  pill
                  gradientDuoTone="purpleToBlue"
                >
                  <p>{t('add')}</p>
                  <HiOutlinePlusCircle className="ml-2 h-5 w-5" />
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
