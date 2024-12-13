import FormikTextInput from 'app/components/inputs/formikTextInput';
import { Button, Modal } from 'flowbite-react';
import { Form, Formik, FormikProps } from 'formik';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';
import * as Yup from 'yup';
import { TeacherDto } from '@/models/teachers/teacher.dto';
import { TeacherCreateRequest } from '@/app/api/teachers/create/route';

interface TeacherCreateFormValues {
  name: string;
  email: string;
  phone: string;
}

export default function CreateTeacherModal({
  schoolId,
  openModal,
  onClose,
  onSave
}: {
  schoolId: string;
  openModal: boolean;
  onClose: () => void;
  onSave: (createdTeacher: TeacherDto, password: string) => void;
}) {
  const t = useTranslations('dashboard.teachers.createModal');
  const tGeneral = useTranslations('dashboard.general');

  return (
    <Modal dismissible show={openModal} onClose={onClose}>
      <Formik
        validateOnMount={true}
        initialValues={{
          name: '',
          email: '',
          phone: ''
        }}
        validationSchema={Yup.object({
          name: Yup.string().required(t('name_is_required')),
          email: Yup.string().email(t('email_is_in_bad_format')).required(t('email_is_required'))
        })}
        onSubmit={async (values, { setSubmitting }) => {
          const response = await fetch('/api/teachers/create', {
            method: 'POST',
            body: JSON.stringify({
              name: values.name,
              email: values.email,
              schoolId: schoolId,
              phone: values.phone
            } as TeacherCreateRequest)
          });

          if (response.ok) {
            toast.success(t('teacher_created'));
            const resJson = await response.json();
            if (resJson.teacher && resJson.password) onSave(resJson.teacher, resJson.password);
            onClose();
          } else {
            toast.error(t('teacher_created_error'));
          }

          setSubmitting(false);
        }}
      >
        {(props: FormikProps<TeacherCreateFormValues>) => (
          <Form>
            <Modal.Header>{t('heading')}</Modal.Header>
            <Modal.Body className="max-h-[50vh]">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="mb-1 whitespace-pre-line text-gray-500 dark:text-gray-400 text-sm">{t('desc')}</p>
                </div>

                <div>
                  <FormikTextInput label={t('teacher_name')} name="name" autoComplete="false" />
                </div>

                <div>
                  <FormikTextInput type="email" label={t('email')} name="email" autoComplete="false" />
                </div>

                <div>
                  <FormikTextInput label={t('phone')} name="phone" autoComplete="false" />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                disabled={!props.isValid || props.isSubmitting}
                type="submit"
                outline
                pill
                gradientDuoTone="purpleToBlue"
                isProcessing={props.isSubmitting}
              >
                <p>{tGeneral('save')}</p>
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
