import FormikTextInput from 'app/components/inputs/formikTextInput';
import { Button } from 'flowbite-react';
import { useTranslations } from 'next-intl';
import { HiOutlineArrowLeft, HiOutlineBuildingLibrary } from 'react-icons/hi2';

export default function SchoolAdditionalInfoForm({
  previousStep,
  isLoading
}: {
  previousStep: () => void;
  isLoading: boolean;
}) {
  const t = useTranslations('dashboard.school.register');

  return (
    <>
      <div id="principal-info" className="mb-2 flex flex-col gap-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">{t('principal')}</h3>

        <div>
          <FormikTextInput label={t('name_surname')} name="principalName" />
        </div>

        <div>
          <FormikTextInput label={t('phone_number')} name="principalPhone" type="tel" />
        </div>

        <div>
          <FormikTextInput label={t('email')} name="principalEmail" />
        </div>
      </div>

      <Button
        className="w-fit mx-auto"
        type="submit"
        outline
        pill
        gradientDuoTone="purpleToBlue"
        isProcessing={isLoading}
      >
        <p>{t('register')}</p>
        <HiOutlineBuildingLibrary className="ml-2 h-5 w-5" />
      </Button>

      <a
        className="inline-flex w-fit cursor-pointer items-center justify-center text-gray-500 hover:underline dark:text-gray-400"
        onClick={previousStep}
      >
        <HiOutlineArrowLeft className="mr-1" />
        <span>{t('return_to_info')}</span>
      </a>
    </>
  );
}
