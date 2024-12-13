'use client';

import FormikTextInput from 'app/components/inputs/formikTextInput';
import { Button, Checkbox, Label, Radio } from 'flowbite-react';
import { FormikProps } from 'formik';
import { useTranslations } from 'next-intl';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import { SchoolRegistrationFormValues } from './schoolRegistrationForm';

export default function SchoolInfoForm({
  props,
  previousStep
}: {
  props: FormikProps<SchoolRegistrationFormValues>;
  previousStep: () => void;
}) {
  const t = useTranslations('dashboard.school.register');
  const tLists = useTranslations('lists');

  const handleRadioChange = async (event: any) => {
    const value = parseInt(event.target.value);
    await props.setFieldValue('schoolType', value);
  };

  return (
    <>
      <div id="info" className="mb-6 flex flex-col gap-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">{t('basic_info')}</h3>

        <div>
          <FormikTextInput label={t('school_name')} name="schoolName" />
        </div>

        <div>
          <FormikTextInput label={t('school_address')} name="address" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <FormikTextInput label={t('city')} name="city" />
          </div>

          <div>
            <FormikTextInput label={t('zip_code')} name="zipCode" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <FormikTextInput label={t('business_id')} name="businessId" />
          </div>

          <div>
            <FormikTextInput label={t('tax_number')} name="taxNumber" />
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="country" value={t('country')} className="mb-2 block" />
          <select
            id="country"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            {...props.getFieldProps('country')}
            value={props.values.country}
            onChange={props.handleChange}
          >
            <option value="0">{tLists('countries.0.name')}</option>
            <option value="1">{tLists('countries.1.name')}</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="billingInfoEqual"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            {...props.getFieldProps('billingInfoEqual')}
            checked={props.values.billingInfoEqual}
            onChange={props.handleChange}
          />
          <Label htmlFor="billingInfoEqual" value={t('billing_info_equal')} className="font-normal" />
        </div>
      </div>

      {!props.values.billingInfoEqual && (
        <div id="billingInfo" className="mb-6 flex flex-col gap-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">{t('billing_info')}</h3>

          <div>
            <FormikTextInput label={t('name')} name="billingName" />
          </div>

          <div>
            <FormikTextInput label={t('address')} name="billingAddress" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <FormikTextInput label={t('city')} name="billingCity" />
            </div>
            <div>
              <FormikTextInput label={t('zip_code')} name="billingZipCode" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <FormikTextInput label={t('business_id')} name="billingBusinessId" />
            </div>

            <div>
              <FormikTextInput label={t('tax_number')} name="billingTaxNumber" />
            </div>
          </div>
        </div>
      )}

      <div id="additionalInfo" className="mb-2 flex flex-col gap-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">{t('additional_info')}</h3>

        <div>
          <Label htmlFor="" value={t('school_type')} className="mb-2 block" />
          <ul
            id="schoolType"
            className="w-full items-center rounded-lg border border-gray-200 bg-gray-50 text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:flex"
          >
            <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
              <div className="flex items-center pl-3">
                <Radio
                  id="type-public"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  {...props.getFieldProps('schoolType')}
                  value={0}
                  checked={props.values.schoolType === 0}
                  onChange={handleRadioChange}
                ></Radio>
                <label
                  htmlFor="type-public"
                  className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {t('school_types.public')}
                </label>
              </div>
            </li>

            <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
              <div className="flex items-center pl-3">
                <Radio
                  id="type-private"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  {...props.getFieldProps('schoolType')}
                  value={1}
                  checked={props.values.schoolType === 1}
                  onChange={handleRadioChange}
                ></Radio>
                <label
                  htmlFor="type-private"
                  className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {t('school_types.private')}
                </label>
              </div>
            </li>

            <li className="w-full dark:border-gray-600">
              <div className="flex items-center pl-3">
                <Radio
                  id="type-religious"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  {...props.getFieldProps('schoolType')}
                  value={2}
                  checked={props.values.schoolType === 2}
                  onChange={handleRadioChange}
                ></Radio>
                <label
                  htmlFor="type-religious"
                  className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {t('school_types.religious')}
                </label>
              </div>
            </li>
          </ul>
        </div>

        <div>
          <FormikTextInput label={t('website')} name="website" />
        </div>
      </div>

      <Button type="submit" outline pill gradientDuoTone="purpleToBlue">
        {t('continue')}
      </Button>

      <a
        className="inline-flex w-fit cursor-pointer items-center justify-center text-gray-500 hover:underline dark:text-gray-400"
        onClick={previousStep}
      >
        <HiOutlineArrowLeft className="mr-1" />
        <span>{t('return_to_find')}</span>
      </a>
    </>
  );
}
