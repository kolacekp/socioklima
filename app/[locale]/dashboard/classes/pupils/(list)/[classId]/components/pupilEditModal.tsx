import FormikTextInput from '@/app/components/inputs/formikTextInput';
import { Button, Label, Modal, Radio } from 'flowbite-react';
import { Form, Formik, FormikProps } from 'formik';
import { PupilDto } from '@/models/pupils/pupilDto';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';
import * as Yup from 'yup';

export interface PupilEditFormValues {
  id: string;
  name: string;
  number: number;
  gender: number;
  nationality: string;
}

export default function PupilEditModal({
  openModal,
  selectedPupil,
  genderRequired,
  onClose,
  onSave
}: {
  openModal: boolean;
  selectedPupil: PupilDto;
  genderRequired: boolean;
  onClose: () => void;
  onSave: (updatedPupil: PupilDto) => void;
}) {
  const t = useTranslations('dashboard.pupils.edit');
  const tGeneral = useTranslations('dashboard.general');
  const tLists = useTranslations('lists');

  const genderValidation = genderRequired ? Yup.number().min(1, t('required')) : Yup.number();

  const handleRadioChange = async (event: any, props: FormikProps<PupilEditFormValues>) => {
    const value = parseInt(event.target.value);
    await props.setFieldValue('gender', value);
  };

  return (
    <Modal dismissible show={openModal} onClose={onClose}>
      <Formik
        validateOnMount={true}
        initialValues={{
          id: selectedPupil.id,
          name: selectedPupil.user.name || '',
          number: selectedPupil.number,
          gender: selectedPupil.gender,
          nationality: selectedPupil.nationality || ''
        }}
        validationSchema={Yup.object({
          id: Yup.string().required(t('required')),
          name: Yup.string().required(t('required')),
          number: Yup.number().required(t('required')),
          gender: genderValidation
        })}
        onSubmit={async (values, { setSubmitting }) => {
          const response = await fetch('/api/pupils/update', {
            method: 'POST',
            body: JSON.stringify(values)
          });

          if (response.ok) {
            const res = await response.json();
            if (res.pupil) onSave(res.pupil);
            onClose();
            toast.success(t('update_success'));
          } else {
            toast.error(t('update_error'));
          }

          setSubmitting(false);
        }}
      >
        {(props: FormikProps<PupilEditFormValues>) => (
          <Form>
            <Modal.Header>
              {t('editing_pupil')} {selectedPupil.user.name}
            </Modal.Header>
            <Modal.Body>
              <div className="flex flex-col gap-4">
                <div>
                  <FormikTextInput label={t('name')} name="name" />
                </div>

                <div>
                  <FormikTextInput type="number" label={t('number')} name="number" />
                </div>

                <div>
                  <Label htmlFor="gender" value={t('gender')} className="mb-2 block" />
                  <ul
                    id="gender"
                    className="w-full items-center rounded-lg border border-gray-200 bg-gray-50 text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:flex"
                  >
                    <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
                      <div className="flex items-center pl-3">
                        <Radio
                          id="none"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          {...props.getFieldProps('gender')}
                          value={0}
                          checked={props.values.gender === 0}
                          onChange={(event) => handleRadioChange(event, props)}
                        ></Radio>
                        <label
                          htmlFor="none"
                          className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {tLists('genders.0')}
                        </label>
                      </div>
                    </li>

                    <li className="w-full dark:border-gray-600">
                      <div className="flex items-center pl-3">
                        <Radio
                          id="male"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          {...props.getFieldProps('gender')}
                          value={1}
                          checked={props.values.gender === 1}
                          onChange={(event) => handleRadioChange(event, props)}
                        ></Radio>
                        <label
                          htmlFor="male"
                          className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {tLists('genders.1')}
                        </label>
                      </div>
                    </li>

                    <li className="w-full dark:border-gray-600">
                      <div className="flex items-center pl-3">
                        <Radio
                          id="female"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          {...props.getFieldProps('gender')}
                          value={2}
                          checked={props.values.gender === 2}
                          onChange={(event) => handleRadioChange(event, props)}
                        ></Radio>
                        <label
                          htmlFor="female"
                          className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {tLists('genders.2')}
                        </label>
                      </div>
                    </li>

                    <li className="w-full dark:border-gray-600">
                      <div className="flex items-center pl-3">
                        <Radio
                          id="other"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          {...props.getFieldProps('gender')}
                          value={3}
                          checked={props.values.gender === 3}
                          onChange={(event) => handleRadioChange(event, props)}
                        ></Radio>
                        <label
                          htmlFor="other"
                          className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {tLists('genders.3')}
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <FormikTextInput type="text" label={t('nationality')} name="nationality" />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                disabled={!props.isValid || props.isSubmitting}
                type="submit"
                isProcessing={props.isSubmitting}
                outline
                pill
                gradientDuoTone="purpleToBlue"
              >
                <p>{t('save')}</p>
                <HiOutlineCheckCircle className="ml-2 h-5 w-5" />
              </Button>
              <Button outline pill gradientDuoTone="pinkToOrange" color="danger" onClick={onClose}>
                <p>{tGeneral('close')}</p>
                <HiOutlineXCircle className="ml-2 h-5 w-5" />
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
