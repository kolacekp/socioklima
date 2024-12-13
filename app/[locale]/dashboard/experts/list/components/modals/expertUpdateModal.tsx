import FormikTextInput from '@/app/components/inputs/formikTextInput';
import { Button, Modal } from 'flowbite-react';
import { Form, Formik, FormikProps } from 'formik';
import { useLocale, useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';
import * as Yup from 'yup';
import { ErrorsEnum } from '@/utils/errors.enum';
import { ExpertDto } from '@/models/experts/expert.dto';
import { ExpertUpdateRequest } from '@/app/api/experts/update/route';

interface ExpertUpdateFormValues {
  name: string;
  email: string;
  phone: string;
}

export default function ExpertUpdateModal({
  openModal,
  selectedExpert,
  onClose,
  onSave
}: {
  openModal: boolean;
  selectedExpert: ExpertDto;
  onClose: () => void;
  onSave: (updatedExpert: ExpertDto) => void;
}) {
  const t = useTranslations('dashboard.experts.update');
  const tGeneral = useTranslations('dashboard.general');
  const locale = useLocale();

  return (
    <Modal dismissible show={openModal} onClose={onClose}>
      <Formik
        validateOnMount={true}
        initialValues={{
          name: selectedExpert.user.name || '',
          email: selectedExpert.user.email || '',
          phone: selectedExpert.user.phone || ''
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email(t('email_is_not_valid')).required(t('email_is_required')),
          name: Yup.string().max(100, t('name_max_100_chars')).required(t('name_is_required'))
        })}
        onSubmit={async (values, { setSubmitting }) => {
          const response = await fetch('/api/experts/update', {
            method: 'POST',
            body: JSON.stringify({
              ...values,
              id: selectedExpert.id,
              userId: selectedExpert.userId,
              locale
            } as ExpertUpdateRequest)
          });

          if (response.ok) {
            const res = await response.json();
            if (res.expert) onSave(res.expert);
            onClose();
            toast.success(t('expert_updated'));
          } else {
            const res = await response.json();
            if (res.code && res.code == ErrorsEnum.E_EMAIL_ALREADY_EXISTS) {
              toast.error(t('email_already_exists'));
            } else {
              toast.error(t('expert_updated_error'));
            }
          }

          setSubmitting(false);
        }}
      >
        {(props: FormikProps<ExpertUpdateFormValues>) => (
          <Form>
            <Modal.Header>
              {t('heading')} {selectedExpert.user.name}
            </Modal.Header>
            <Modal.Body>
              <div className="flex flex-col gap-4">
                <div>
                  <FormikTextInput label={t('name')} name="name" autoComplete="false" />
                </div>
                <div>
                  <FormikTextInput label={t('email')} name="email" type="email" autoComplete="false" />
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
