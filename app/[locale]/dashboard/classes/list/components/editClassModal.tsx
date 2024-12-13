'use client';

import FormikTextInput from 'app/components/inputs/formikTextInput';
import { Button, Label, Modal, ToggleSwitch } from 'flowbite-react';
import { Form, Formik, FormikProps } from 'formik';
import { Dispatch, SetStateAction } from 'react';
import { ClassListDto } from '@/models/classes/classList.dto';
import { useTranslations } from 'next-intl';
import { HiOutlineXCircle } from 'react-icons/hi2';

export interface EditClassFormValues {
  id: string;
  name: string;
  grade: number;
  genderRequired: boolean;
}

export default function EditClassModal({
  selectedClass,
  openModal,
  setOpenModal,
  onSubmit
}: {
  selectedClass: ClassListDto;
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  onSubmit: (values: EditClassFormValues) => void;
}) {
  const tLists = useTranslations('lists');
  const t = useTranslations('dashboard.classes.list.edit_modal');

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleGenderRequiredChange = async (value: boolean, props: FormikProps<EditClassFormValues>) => {
    await props.setFieldValue('genderRequired', value);
  };

  return (
    <Modal dismissible show={openModal} onClose={handleCloseModal}>
      <Formik
        initialValues={{
          id: selectedClass.id,
          name: selectedClass.name,
          grade: selectedClass.grade,
          genderRequired: selectedClass.genderRequired
        }}
        onSubmit={async (values) => {
          onSubmit(values);
        }}
      >
        {(props: FormikProps<EditClassFormValues>) => (
          <Form>
            <Modal.Header>{t('heading')}</Modal.Header>

            <Modal.Body>
              <div className="flex flex-col gap-4">
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

                <div className="my-2">
                  <ToggleSwitch
                    color="purple"
                    label={t('gender_required')}
                    checked={props.values.genderRequired}
                    onChange={(value) => handleGenderRequiredChange(value, props)}
                  />
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button outline pill gradientDuoTone="purpleToBlue" type="submit">
                {t('save')}
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
