import FormikTextInput from '@/app/components/inputs/formikTextInput';
import { SchoolDetailWithUsers } from '@/models/schools/schoolDetailWithUsers';
import { Alert, Button, Modal } from 'flowbite-react';
import { Form, Formik, FormikProps } from 'formik';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction } from 'react';
import { HiOutlineXCircle, HiOutlineCheckCircle } from 'react-icons/hi2';
import * as Yup from 'yup';

export interface ChangeManagerFormValues {
  schoolId: string;
  email: string;
}

export default function ChangeManagerModal({
  school,
  openModal,
  setOpenModal,
  onSubmit
}: {
  school: SchoolDetailWithUsers;
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  onSubmit: (values: ChangeManagerFormValues) => Promise<void>;
}) {
  const t = useTranslations('dashboard.school.detail.tabs.info.change_manager_modal');

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const changeManagerSchema = Yup.object().shape({
    email: Yup.string().email(t('invalid_email')).required(t('required'))
  });

  return (
    <Modal dismissible show={openModal} onClose={handleCloseModal}>
      <Formik
        validateOnMount={true}
        initialValues={{
          schoolId: school.id,
          email: ''
        }}
        validationSchema={changeManagerSchema}
        onSubmit={async (values) => {
          await onSubmit(values);
        }}
      >
        {(props: FormikProps<ChangeManagerFormValues>) => (
          <Form>
            <Modal.Header>{t('heading')}</Modal.Header>

            <Modal.Body className="max-h-[50vh]">
              <div className="mb-4">
                <Alert color={'purple'}>{t('info')}</Alert>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <FormikTextInput label={t('email')} name="email" />
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
