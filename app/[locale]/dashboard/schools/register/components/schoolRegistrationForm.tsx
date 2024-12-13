'use client';

import { Form, Formik, FormikProps } from 'formik';
import { useLocale, useTranslations } from 'next-intl';
import { SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import RegistrationSuccessful from './registrationSuccessful';
import SchoolAdditionalInfoForm from './schoolAdditionalInfoForm';
import SchoolFinderForm from './schoolFinderForm';
import SchoolInfoForm from './schoolInfoForm';
import Stepper from './stepper';
import { SchoolRegistrationRequest } from '@/app/api/schools/create/route';
import { useRouter } from 'next/navigation';

export interface SchoolRegistrationFormValues {
  businessIdSearch?: string;
  country: number;
  schoolName: string;
  address: string;
  city: string;
  zipCode: string;
  businessId: string;
  taxNumber: string;
  billingInfoEqual: boolean;
  billingName: string;
  billingAddress: string;
  billingCity: string;
  billingZipCode: string;
  billingBusinessId: string;
  billingTaxNumber: string;
  schoolType: number;
  website: string;
  principalName: string;
  principalPhone: string;
  principalEmail: string;
}

export default function SchoolRegistrationForm() {
  const t = useTranslations('dashboard.school.register');
  const [step, setStep] = useState(0);
  const stepItems = [t('find_school'), t('school_info'), t('principal_info'), t('heading')];
  const [isLoading, setIsLoading] = useState(false);
  const locale = useLocale();
  const router = useRouter();

  // Stepper
  const nextStep = () => {
    setStep((i) => {
      if (i >= stepItems.length) return i;
      return i + 1;
    });
  };

  const previousStep = () => {
    setStep((i) => {
      if (i <= 0) return i;
      return i - 1;
    });
  };

  const resetStep = () => {
    setStep(0);
  };

  // Form Actions
  const getSchoolInfo = async (
    values: SchoolRegistrationFormValues,
    setValues: (values: SetStateAction<SchoolRegistrationFormValues>, shouldValidate?: boolean | undefined) => void
  ) => {
    if (!values.businessIdSearch || values.country === null) return;

    setIsLoading(true);
    const url = '/api/school-register';
    const response = await fetch(url + `?businessid=${values.businessIdSearch}&country=${values.country}`, {
      method: 'GET'
    });

    const info: SchoolRegistrationFormValues & { error: string } = await response.json();
    setIsLoading(false);

    if (info.error) {
      toast.error(t('errors.external_register_error'));
      return;
    }

    setValues({
      ...initialValues,
      ...info,
      businessIdSearch: info.businessId,
      country: values.country
    });

    nextStep();
  };

  const createSchool = async (
    values: SchoolRegistrationFormValues,
    setValues: (values: SetStateAction<SchoolRegistrationFormValues>, shouldValidate?: boolean | undefined) => void
  ) => {
    setIsLoading(true);
    delete values.businessIdSearch;

    const url = '/api/schools/create';
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        ...values,
        locale
      } as SchoolRegistrationRequest)
    });

    const body = (await res.json()) as { isCreated: boolean; message?: string };
    if (res.status == 200 && body.isCreated) {
      setValues({ ...initialValues });
      toast.success(t('school_created'));
      setTimeout(() => {
        window.location.href = '/dashboard/schools/list';
      }, 1000);
    } else {
      if (body.message) {
        toast.error(body.message);
      } else {
        toast.error(t('school_create_failure'));
      }
    }
    setIsLoading(false);
  };

  // Formik
  const initialValues: SchoolRegistrationFormValues = {
    businessIdSearch: '',
    country: 0,
    schoolName: '',
    address: '',
    city: '',
    zipCode: '',
    businessId: '',
    taxNumber: '',
    billingInfoEqual: true,
    billingName: '',
    billingAddress: '',
    billingCity: '',
    billingZipCode: '',
    billingBusinessId: '',
    billingTaxNumber: '',
    schoolType: 0,
    website: '',
    principalName: '',
    principalPhone: '',
    principalEmail: ''
  };

  const schoolFinderSchema = Yup.object().shape({
    businessIdSearch: Yup.string().length(8, t('validations.business_id_length')).required(t('validations.required')),
    country: Yup.number().min(0).max(1).required(t('validations.required'))
  });

  const schoolInfoSchema = Yup.object().shape({
    schoolName: Yup.string().required(t('validations.required')),
    address: Yup.string().required(t('validations.required')),
    city: Yup.string().required(t('validations.required')),
    zipCode: Yup.string().required(t('validations.required')),
    businessId: Yup.string().length(8, t('validations.business_id_length')).required(t('validations.required')),
    taxNumber: Yup.string(),
    country: Yup.number().required(t('validations.required')),

    billingInfoEqual: Yup.bool().required(t('validations.required')),
    billingName: Yup.string().when('billingInfoEqual', {
      is: false,
      then: (schema) => schema.required(t('validations.required'))
    }),
    billingAddress: Yup.string().when('billingInfoEqual', {
      is: false,
      then: (schema) => schema.required(t('validations.required'))
    }),
    billingCity: Yup.string().when('billingInfoEqual', {
      is: false,
      then: (schema) => schema.required(t('validations.required'))
    }),
    billingZipCode: Yup.string().when('billingInfoEqual', {
      is: false,
      then: (schema) => schema.required(t('validations.required'))
    }),
    billingBusinessId: Yup.string().when('billingInfoEqual', {
      is: false,
      then: (schema) => schema.length(8, t('validations.business_id_length')).required(t('validations.required'))
    }),
    billingTaxNumber: Yup.string(),

    schoolType: Yup.number().required(t('validations.required')),
    website: Yup.string().matches(
      /((https?):\/\/)?(www.)?[a-z0-9-]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#-]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      t('validations.url_invalid')
    )
  });

  const schoolAdditionalInfoSchema = Yup.object().shape({
    principalName: Yup.string().required(t('validations.required')),
    principalPhone: Yup.string().required(t('validations.required')),
    principalEmail: Yup.string().email(t('validations.email_invalid')).required(t('validations.required'))
  });

  return (
    <>
      <div
        className="text-gray-300 cursor-pointer hover:text-gray-400 text-sm w-fit"
        onClick={() => router.push('/dashboard/schools/list')}
      >
        ← {t('back')}
      </div>
      <Stepper step={step} stepItems={stepItems.slice(0, -1)} />
      <div className="shadow-md mx-auto max-w-xl rounded-t-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
        <span className="text-gray-800 dark:text-white">{stepItems[step]}</span>
      </div>

      <div
        className="shadow-md mx-auto max-w-xl rounded-b-xl border-x border-b border-gray-200 bg-white bg-gradient-to-r p-0 dark:border-gray-600
      dark:bg-gray-900"
      >
        <div className="mx-auto w-full rounded-b-xl bg-white bg-gradient-to-r p-2 dark:bg-gray-900 sm:p-6">
          <Formik
            validateOnMount={true}
            initialValues={initialValues}
            validationSchema={
              step === 0
                ? schoolFinderSchema
                : step === 1
                ? schoolInfoSchema
                : step === 2
                ? schoolAdditionalInfoSchema
                : null
            }
            onSubmit={async (values, { setValues, setTouched }) => {
              step === 0 && (await getSchoolInfo(values, setValues));
              step === 1 && nextStep();
              step === 2 && (await createSchool(values, setValues));

              await setTouched({});
            }}
          >
            {(props: FormikProps<SchoolRegistrationFormValues>) => (
              <Form className="flex flex-col gap-4">
                {step === 0 && <SchoolFinderForm props={props} nextStep={nextStep} isLoading={isLoading} />}
                {step === 1 && <SchoolInfoForm props={props} previousStep={previousStep} />}
                {step === 2 && <SchoolAdditionalInfoForm previousStep={previousStep} isLoading={isLoading} />}
                {step === 3 && <RegistrationSuccessful resetStep={resetStep} />}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
