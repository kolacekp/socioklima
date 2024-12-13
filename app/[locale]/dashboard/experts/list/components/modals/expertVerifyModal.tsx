import FormikTextInput from '@/app/components/inputs/formikTextInput';
import { Button, Checkbox, Label, Modal } from 'flowbite-react';
import { Form, Formik, FormikProps } from 'formik';
import { useLocale, useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';
import * as Yup from 'yup';
import { ExpertDto } from '@/models/experts/expert.dto';
import { ExpertVerifyRequest } from '@/app/api/experts/verify/route';

interface ExpertVerifyFormValues {
  authorizationNumber: string;
  isVerified: boolean;
}

export default function ExpertVerifyModal({
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
  const t = useTranslations('dashboard.experts.verify');
  const tGeneral = useTranslations('dashboard.general');
  const locale = useLocale();

  return (
    <Modal dismissible show={openModal} onClose={onClose}>
      <Formik
        validateOnMount={true}
        initialValues={{
          authorizationNumber: selectedExpert.authorizationNumber || '',
          isVerified: selectedExpert.isVerified
        }}
        validationSchema={Yup.object().shape({
          authorizationNumber: Yup.string().required(t('authorization_number_is_required'))
        })}
        onSubmit={async (values, { setSubmitting }) => {
          const response = await fetch('/api/experts/verify', {
            method: 'POST',
            body: JSON.stringify({
              ...values,
              id: selectedExpert.id,
              locale
            } as ExpertVerifyRequest)
          });

          if (response.ok) {
            const res = await response.json();
            if (res.expert) onSave(res.expert);
            onClose();
            toast.success(t('expert_verified'));
          } else {
            toast.error(t('expert_verify_error'));
          }

          setSubmitting(false);
        }}
      >
        {(props: FormikProps<ExpertVerifyFormValues>) => (
          <Form>
            <Modal.Header>
              {t('heading')} {selectedExpert.user.name}
            </Modal.Header>
            <Modal.Body>
              <div className="flex flex-col gap-4">
                <div>
                  <FormikTextInput label={t('authorization_number')} name="authorizationNumber" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="isVerified"
                      name="isVerified"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={props.values.isVerified}
                      onChange={props.handleChange}
                    />
                    <Label htmlFor="isVerified" value={t('is_verified')} className="font-normal" />
                  </div>
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
