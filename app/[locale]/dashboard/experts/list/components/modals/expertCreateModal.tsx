import FormikTextInput from '@/app/components/inputs/formikTextInput';
import { Button, Modal } from 'flowbite-react';
import { Form, Formik, FormikProps } from 'formik';
import { useLocale, useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';
import * as Yup from 'yup';
import { ExpertCreateRequest } from '@/app/api/experts/create/route';
import { ErrorsEnum } from '@/utils/errors.enum';
import { useConfirm } from '@/app/components/confirm/confirmProvider';
import { ExpertExtendRequest } from '@/app/api/experts/extend/route';

interface ExpertCreateFormValues {
  name: string;
  email: string;
  phone: string;
}

export default function ExpertCreateModal({
  schoolId,
  openModal,
  onClose,
  onSave
}: {
  schoolId: string;
  openModal: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  const t = useTranslations('dashboard.experts.create');
  const tGeneral = useTranslations('dashboard.general');
  const locale = useLocale();
  const { showConfirm } = useConfirm();

  async function handleExtendSameSchool(userId: string) {
    showConfirm({
      title: t('expert_extend_same_title'),
      confirmMessage: t('expert_extend_message_same_school'),
      async onConfirm() {
        const response = await fetch('/api/experts/extend', {
          method: 'POST',
          body: JSON.stringify({
            userId: userId,
            schoolId: schoolId
          } as ExpertExtendRequest)
        });

        if (response.ok) {
          toast.success(t('expert_created'));
          await onSave();
          onClose();
        } else {
          toast.error(t('expert_created_error'));
        }
      }
    });
  }

  async function handleExtendDifferentSchool(userId: string) {
    showConfirm({
      title: t('expert_extend_different_title'),
      confirmMessage: t('expert_extend_message_different_school'),
      async onConfirm() {
        const response = await fetch('/api/experts/extend', {
          method: 'POST',
          body: JSON.stringify({
            userId: userId,
            schoolId: schoolId
          } as ExpertExtendRequest)
        });

        if (response.ok) {
          toast.success(t('expert_created'));
          await onSave();
          onClose();
        } else {
          toast.error(t('expert_created_error'));
        }
      }
    });
  }

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
          email: Yup.string().required(t('email_is_required')).email(t('email_is_in_bad_format')),
          phone: Yup.string()
        })}
        onSubmit={async (values, { setSubmitting }) => {
          const response = await fetch('/api/experts/create', {
            method: 'POST',
            body: JSON.stringify({
              ...values,
              schoolId: schoolId,
              locale
            } as ExpertCreateRequest)
          });

          if (response.ok) {
            toast.success(t('expert_created'));
            await onSave();
            onClose();
          } else {
            const res = await response.json();
            if (res.code && res.code == ErrorsEnum.E_EMAIL_ALREADY_EXISTS) {
              toast.error(t('email_already_exists'));
            } else if (res.code && res.code == ErrorsEnum.E_EXPERT_FOR_SAME_SCHOOL && res.userId) {
              await handleExtendSameSchool(res.userId);
            } else if (res.code && res.code == ErrorsEnum.E_EXPERT_FOR_DIFFERENT_SCHOOL && res.userId) {
              await handleExtendDifferentSchool(res.userId);
            } else {
              toast.error(t('expert_created_error'));
            }
          }

          setSubmitting(false);
        }}
      >
        {(props: FormikProps<ExpertCreateFormValues>) => (
          <Form>
            <Modal.Header>{t('heading')}</Modal.Header>
            <Modal.Body>
              <div className="flex flex-col gap-4">
                <div>
                  <FormikTextInput label={t('name')} name="name" autoComplete="false" />
                </div>

                <div>
                  <FormikTextInput type="email" label={t('email')} name="email" autoComplete="false" />
                </div>

                <div>
                  <FormikTextInput label={t('phone')} name="phone" />
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
