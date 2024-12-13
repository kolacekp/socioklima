import FormikTextInput from '@/app/components/inputs/formikTextInput';
import { SchoolDetailWithUsers } from '@/models/schools/schoolDetailWithUsers';
import { Button, Checkbox, Label, Modal, Radio } from 'flowbite-react';
import { Form, Formik, FormikProps } from 'formik';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction } from 'react';
import { HiOutlineXCircle, HiOutlineCheckCircle } from 'react-icons/hi2';
import * as Yup from 'yup';

export interface EditSchoolFormValues {
  id: string;
  country: number;
  schoolName: string;
  address: string;
  city: string;
  zipCode: string;
  businessId: string;
  taxNumber: string | null;
  billingInfoEqual: boolean;
  billingName: string | null;
  billingAddress: string | null;
  billingCity: string | null;
  billingZipCode: string | null;
  billingBusinessId: string | null;
  billingTaxNumber: string | null;
  schoolType: number;
  website: string | null;
}

export default function SchoolEditModal({
  school,
  openModal,
  setOpenModal,
  onSubmit
}: {
  school: SchoolDetailWithUsers;
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  onSubmit: (values: EditSchoolFormValues) => Promise<void>;
}) {
  const t = useTranslations('dashboard.school.edit');
  const tLists = useTranslations('lists');

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleRadioChange = async (event: any, props: FormikProps<any>) => {
    const value = parseInt(event.target.value);
    await props.setFieldValue('schoolType', value);
  };

  const editSchoolFormSchema = Yup.object().shape({
    schoolName: Yup.string().required(t('validations.required')),
    address: Yup.string().required(t('validations.required')),
    city: Yup.string().required(t('validations.required')),
    zipCode: Yup.string().required(t('validations.required')),
    businessId: Yup.string().length(8, t('validations.business_id_length')).required(t('validations.required')),
    country: Yup.number().min(0).max(1).required(t('validations.required')),
    billingInfoEqual: Yup.bool().required(t('validations.required')),
    schoolType: Yup.number().required(t('validations.required')),
    website: Yup.string().matches(
      /((https?):\/\/)?(www.)?[a-z0-9-]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#-]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      t('validations.url_invalid')
    )
  });

  return (
    <Modal dismissible show={openModal} onClose={handleCloseModal}>
      <Formik
        validateOnMount={true}
        initialValues={{
          id: school.id,
          country: school.country,
          schoolName: school.schoolName,
          address: school.address,
          city: school.city,
          zipCode: school.zipCode,
          businessId: school.businessId,
          taxNumber: school.taxNumber,
          billingInfoEqual: school.billingInfoEqual,
          billingName: school.billingName,
          billingAddress: school.billingAddress,
          billingCity: school.billingCity,
          billingZipCode: school.billingZipCode,
          billingBusinessId: school.billingBusinessId,
          billingTaxNumber: school.billingTaxNumber,
          schoolType: school.schoolType,
          website: school.website
        }}
        validationSchema={editSchoolFormSchema}
        onSubmit={async (values) => {
          await onSubmit(values);
        }}
      >
        {(props: FormikProps<EditSchoolFormValues>) => (
          <Form>
            <Modal.Header>{t('heading')}</Modal.Header>

            <Modal.Body className="max-h-[50vh]">
              <div className="flex flex-col gap-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">{t('basic_info')}</h3>

                <div>
                  <FormikTextInput label={t('name')} name="schoolName" />
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

                <div>
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

                <div className="flex items-center gap-2 mt-4 mb-2">
                  <Checkbox
                    id="billingInfoEqual"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    {...props.getFieldProps('billingInfoEqual')}
                    checked={props.values.billingInfoEqual}
                    onChange={props.handleChange}
                  />
                  <Label htmlFor="billingInfoEqual" value={t('billing_info_equal')} className="font-normal" />
                </div>

                {!props.values.billingInfoEqual && (
                  <div id="billingInfo" className="flex flex-col gap-4">
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
                            onChange={(e) => handleRadioChange(e, props)}
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
                            onChange={(e) => handleRadioChange(e, props)}
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
                            onChange={(e) => handleRadioChange(e, props)}
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
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button
                outline
                pill
                gradientDuoTone="purpleToBlue"
                type="submit"
                disabled={props.isSubmitting || !props.isValid}
              >
                {t('save')}
                <HiOutlineCheckCircle className="ml-2 h-5 w-5" />
              </Button>
              <Button outline pill gradientDuoTone="pinkToOrange" color="danger" onClick={handleCloseModal}>
                <p>{t('close')}</p>
                <HiOutlineXCircle className="ml-2 h-5 w-5" />
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
