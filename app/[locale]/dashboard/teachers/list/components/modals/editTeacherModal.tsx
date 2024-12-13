import FormikTextInput from 'app/components/inputs/formikTextInput';
import { Button, Modal } from 'flowbite-react';
import { Form, Formik, FormikProps } from 'formik';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';
import * as Yup from 'yup';
import { TeacherDto } from '@/models/teachers/teacher.dto';
import { ErrorsEnum } from '@/utils/errors.enum';
import { TeacherUpdateRequest } from '@/app/api/teachers/update/route';

interface TeacherUpdateFormValues {
  name: string;
  email: string;
  phone: string;
}

export default function EditTeacherModal({
  openModal,
  selectedTeacher,
  onClose,
  onSave
}: {
  openModal: boolean;
  selectedTeacher: TeacherDto;
  onClose: () => void;
  onSave: (updatedTeacher: TeacherDto) => void;
}) {
  const t = useTranslations('dashboard.teachers.editModal');
  const tGeneral = useTranslations('dashboard.general');

  return (
    <Modal dismissible show={openModal} onClose={onClose}>
      <Formik
        validateOnMount={true}
        initialValues={{
          name: selectedTeacher.user.name || '',
          email: selectedTeacher.user.email || '',
          phone: selectedTeacher.user.phone || ''
        }}
        validationSchema={Yup.object({
          name: Yup.string().required(t('name_is_required')),
          email: Yup.string().email(t('email_is_in_bad_format'))
        })}
        onSubmit={async (values, { setSubmitting }) => {
          const response = await fetch('/api/teachers/update', {
            method: 'POST',
            body: JSON.stringify({
              id: selectedTeacher.id,
              name: values.name,
              email: values.email,
              phone: values.phone,
              userId: selectedTeacher.userId
            } as TeacherUpdateRequest)
          });

          if (response.ok) {
            const res = await response.json();
            if (res.teacher) onSave(res.teacher);
            onClose();
            toast.success(t('teacher_updated'));
          } else {
            const res = await response.json();
            if (res.code && res.code == ErrorsEnum.E_EMAIL_ALREADY_EXISTS) {
              toast.error(t('email_already_exists'));
            } else {
              toast.error(t('teacher_updated_error'));
            }
          }

          setSubmitting(false);
        }}
      >
        {(props: FormikProps<TeacherUpdateFormValues>) => (
          <Form>
            <Modal.Header>
              {t('editing_teacher')} {selectedTeacher.user.name}
            </Modal.Header>
            <Modal.Body>
              <div className="flex flex-col gap-4">
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
