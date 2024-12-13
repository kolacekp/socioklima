'use client';

import FormikTextInput from 'app/components/inputs/formikTextInput';
import { Button, Label, Modal } from 'flowbite-react';
import { Form, Formik, FormikProps } from 'formik';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ClassListDto } from '@/models/classes/classList.dto';
import { useTranslations } from 'next-intl';
import { LicenseDto } from '@/models/licenses/licenseDto';

const getLicenses = async () => {
  const url = '/api/licenses';
  const response = await fetch(url, { method: 'GET' });
  const data = await response.json();
  return data.licenses;
};

export interface UpgradeClassFormValues {
  id: string;
  name: string;
  grade: number;
  licenseId: string;
}

export default function UpgradeClassModal({
  selectedClass,
  openModal,
  setOpenModal,
  onSubmit
}: {
  selectedClass: ClassListDto;
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  onSubmit: (values: UpgradeClassFormValues) => void;
}) {
  const [licenses, setLicenses] = useState<LicenseDto[]>([]);
  const [, setIsLoading] = useState(false);
  const tLists = useTranslations('lists');
  const t = useTranslations('dashboard.classes.list.upgrade_modal');

  useEffect(() => {
    getLicenses()
      .then((licenses) => setLicenses(licenses))
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Modal dismissible show={openModal} onClose={handleCloseModal}>
      {licenses.length > 0 ? (
        <Formik
          initialValues={{
            id: selectedClass.id,
            name: selectedClass.name,
            grade: selectedClass.grade + 1,
            licenseId: licenses[0].id
          }}
          onSubmit={async (values) => {
            onSubmit(values);
          }}
        >
          {(props: FormikProps<UpgradeClassFormValues>) => (
            <Form>
              <Modal.Header>{t('heading')}</Modal.Header>

              <Modal.Body>
                <>
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
                            {`${tLists('products.' + license.product)} | ${t('valid_from')} ${new Date(
                              license.validFrom
                            ).toLocaleDateString('cs-CZ')} ${t('valid_until')} ${new Date(
                              license.validUntil
                            ).toLocaleDateString('cs-CZ')} | ${t('remaining')} ${license.classesRemaining} ${t(
                              'classes'
                            )}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              </Modal.Body>

              <Modal.Footer>
                <Button outline pill gradientDuoTone="purpleToBlue" type="submit">
                  {t('save')}
                </Button>
                <Button outline pill gradientDuoTone="pinkToOrange" color="danger" onClick={handleCloseModal}>
                  {t('close')}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      ) : (
        <>
          <Modal.Header>{t('heading')}</Modal.Header>
          <Modal.Body>{t('no_licenses')}</Modal.Body>
          <Modal.Footer>
            <Button outline pill gradientDuoTone="pinkToOrange" color="danger" onClick={handleCloseModal}>
              {t('close')}
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}
