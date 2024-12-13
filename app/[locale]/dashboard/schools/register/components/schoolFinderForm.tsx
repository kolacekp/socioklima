import { Button, Label, Spinner } from 'flowbite-react';
import { FormikProps } from 'formik';
import { useTranslations } from 'next-intl';
import { SchoolRegistrationFormValues } from './schoolRegistrationForm';

export default function SchoolFinderForm({
  props,
  nextStep,
  isLoading
}: {
  props: FormikProps<SchoolRegistrationFormValues>;
  nextStep: () => void;
  isLoading: boolean;
}) {
  const t = useTranslations('dashboard.school.register');

  return (
    <>
      <div className="mb-2">
        <div className="mb-2 block">
          <Label htmlFor="businessIdSearch" value={t('input_id')} />
        </div>
        <div className="relative w-full">
          <input
            className={
              'block w-full rounded-lg border bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ' +
              (props.touched.businessIdSearch && props.errors.businessIdSearch ? 'border-red-600' : 'border-gray-300')
            }
            id="businessIdSearch"
            placeholder="00000000"
            value={props.values.businessIdSearch}
            onChange={props.handleChange}
          />
          <select
            id="countries"
            className="absolute right-0 top-0 cursor-pointer rounded-lg rounded-l-none border border-gray-300 bg-gray-100 p-2.5 text-sm text-gray-500 hover:bg-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:placeholder-gray-400 dark:hover:bg-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            {...props.getFieldProps('country')}
            value={props.values.country}
            onChange={props.handleChange}
          >
            <option value="0">CZ</option>
            <option value="1">SK</option>
          </select>
        </div>
        {props.touched.businessIdSearch && props.errors.businessIdSearch ? (
          <span className="text-sm text-red-600">{props.errors.businessIdSearch}</span>
        ) : null}
      </div>

      <Button type="submit" outline pill gradientDuoTone="purpleToBlue">
        {isLoading ? <Spinner size="sm" /> : t('find_by_id')}
      </Button>
      <a
        className="mx-auto w-fit cursor-pointer text-blue-700 hover:underline dark:text-blue-500"
        onClick={async () => {
          nextStep();
          await props.setTouched({});
        }}
      >
        {t('input_manually')}
      </a>
    </>
  );
}
