import { useTranslations } from 'next-intl';
import { HiOutlineArrowLeft } from 'react-icons/hi2';

export default function RegistrationSuccessful({ resetStep }: { resetStep: () => void }) {
  const t = useTranslations('dashboard.school.register');

  return (
    <>
      <span className="text-center font-medium">{t('school_created')}</span>
      <a
        className="inline-flex w-fit cursor-pointer items-center justify-center text-gray-500 hover:underline dark:text-gray-400"
        onClick={resetStep}
      >
        <HiOutlineArrowLeft className="mr-1" />
        <span>{t('return_to_find')}</span>
      </a>
    </>
  );
}
