'use client';

import { getLicensePrice } from '@/utils/licensePrice';
import FormikTextInput from 'app/components/inputs/formikTextInput';
import { Button, Checkbox, Label, Radio } from 'flowbite-react';
import { Form, Formik, FormikProps } from 'formik';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePlusCircle } from 'react-icons/hi2';

export interface AddLicenseFormValues {
  classesTotal: number;
  product: number;
  price?: string;
  generateInvoice?: boolean;
  schoolId: string;
  isUnlimited: boolean;
}

export default function CreateLicenseForm({
  schoolId,
  isAdmin,
  country
}: {
  schoolId: string;
  isAdmin: boolean;
  country: number;
}) {
  const t = useTranslations('dashboard.licenses.create');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const unlimitedPrice = getLicensePrice(country, 1, 49, true);

  let initialValues: AddLicenseFormValues = {
    classesTotal: 1,
    product: 0,
    schoolId: schoolId,
    isUnlimited: false
  };

  if (isAdmin) {
    initialValues = {
      ...initialValues,
      price: '',
      generateInvoice: true
    };
  }

  const handleRadioChange = async (event: any, props: FormikProps<AddLicenseFormValues>) => {
    const value = parseInt(event.target.value);
    await props.setFieldValue('product', value);
  };

  const addUnlimitedLicense = async (values: AddLicenseFormValues) => {
    setIsLoading(true);
    const url = '/api/licenses/create';

    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        ...values,
        classesTotal: 49,
        product: 1,
        isUnlimited: true
      })
    });

    const body = (await res.json()) as { isCreated: boolean };
    if (res.status == 200 && body.isCreated) {
      toast.success(t('order_succesful'));
      setTimeout(() => {
        window.location.href = '/dashboard/licenses/list';
      }, 1000);
    } else {
      toast.error(t('order_failed'));
    }
    setIsLoading(false);
  };

  return (
    <>
      <div
        className="text-gray-300 cursor-pointer hover:text-gray-400 text-sm w-fit"
        onClick={() => router.push('/dashboard/licenses/list')}
      >
        ← {t('back')}
      </div>
      <div className="shadow-md mx-auto max-w-xl rounded-t-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
        <span className="text-gray-800 dark:text-white">{t('heading')}</span>
      </div>
      <div className="shadow-md mx-auto max-w-xl rounded-b-xl border-x border-b border-gray-200 bg-white bg-gradient-to-r p-0 dark:border-gray-600 dark:bg-gray-900">
        <div className="mx-auto w-full rounded-b-xl bg-white bg-gradient-to-r p-2 dark:bg-gray-900 sm:p-6">
          <Formik
            validateOnMount={true}
            initialValues={initialValues}
            onSubmit={async (values) => {
              const url = '/api/licenses/create';
              const res = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({ ...values })
              });

              const body = (await res.json()) as { isCreated: boolean };
              if (res.status == 200 && body.isCreated) {
                toast.success(t('order_succesful'));
                setTimeout(() => {
                  window.location.href = '/dashboard/licenses/list';
                }, 1000);
              } else {
                toast.error(t('order_failed'));
              }
            }}
          >
            {(props: FormikProps<AddLicenseFormValues>) => (
              <Form className="flex flex-col gap-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">{t('order_unlimited')}</h3>

                <div>
                  <p className="mb-3 text-gray-500 dark:text-gray-400">
                    {t('unlimited_desc1') + unlimitedPrice + t('unlimited_desc2')}
                  </p>
                </div>

                {isAdmin && (
                  <>
                    <div>
                      <FormikTextInput label={t('admin_price')} name="price" type="number" />
                    </div>

                    <div className="mb-3 flex items-center gap-2">
                      <Checkbox
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        color="purple"
                        id="generateInvoice"
                        {...props.getFieldProps('generateInvoice')}
                        checked={props.values.generateInvoice}
                      />
                      <Label htmlFor="generateInvoice">{t('admin_invoice')}</Label>
                    </div>
                  </>
                )}

                <Button
                  onClick={() => addUnlimitedLicense(props.values)}
                  isProcessing={isLoading}
                  disabled={!props.isValid || props.isSubmitting}
                  outline
                  pill
                  gradientDuoTone="purpleToBlue"
                >
                  <p>{t('unlimited_submit')}</p>
                  <HiOutlinePlusCircle className="ml-2 h-5 w-5" />
                </Button>
                <div className="text-sm text-gray-500 text-center">{t('order_agreement')}</div>

                <hr className="my-6 h-px border-0 bg-gray-200 dark:bg-gray-700"></hr>

                <h3 className="font-semibold text-gray-900 dark:text-white">{t('order_classes')}</h3>

                <div>
                  <Label htmlFor="classesTotal" value={t('classes_total')} className="mb-2 block" />
                  <div className="flex items-center">
                    <input
                      id="classesTotal"
                      type="range"
                      min="1"
                      max="50"
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                      {...props.getFieldProps('classesTotal')}
                    />
                    <span className="ml-2 w-4 text-end text-sm">{props.values.classesTotal}</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="product" value={t('product')} className="mb-2 block" />
                  <ul
                    id="product"
                    className="w-full items-center rounded-lg border border-gray-200 bg-gray-50 text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:flex"
                  >
                    <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
                      <div className="flex items-center pl-3">
                        <Radio
                          id="basic"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          {...props.getFieldProps('product')}
                          value={0}
                          checked={props.values.product === 0}
                          onChange={(event) => handleRadioChange(event, props)}
                        ></Radio>
                        <label
                          htmlFor="basic"
                          className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {t('basic')}
                        </label>
                      </div>
                    </li>

                    <li className="w-full dark:border-gray-600">
                      <div className="flex items-center pl-3">
                        <Radio
                          id="detail"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          {...props.getFieldProps('product')}
                          value={1}
                          checked={props.values.product === 1}
                          onChange={(event) => handleRadioChange(event, props)}
                        ></Radio>
                        <label
                          htmlFor="detail"
                          className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {t('detail')}
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>

                {isAdmin && (
                  <>
                    <div>
                      <FormikTextInput label={t('admin_price')} name="price" type="number" />
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        id="generateInvoice"
                        {...props.getFieldProps('generateInvoice')}
                        checked={props.values.generateInvoice}
                      />
                      <Label htmlFor="generateInvoice">{t('admin_invoice')}</Label>
                    </div>
                  </>
                )}

                <div className="my-3">
                  <h3 className="text-gray-900 dark:text-white">
                    <span className="font-semibold">{t('price_summary')}: </span>
                    <span>
                      {!props.values.price
                        ? getLicensePrice(country, props.values.product, props.values.classesTotal, false)
                        : props.values.price}
                    </span>
                    <span> {t('currency.' + country)}</span>
                  </h3>
                </div>

                <Button
                  type="submit"
                  isProcessing={props.isSubmitting}
                  disabled={!props.isValid || props.isSubmitting}
                  outline
                  pill
                  gradientDuoTone="purpleToBlue"
                >
                  <p>{t('submit')}</p>
                  <HiOutlinePlusCircle className="ml-2 h-5 w-5" />
                </Button>
                <div className="text-sm text-gray-500 text-center">{t('order_agreement')}</div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
