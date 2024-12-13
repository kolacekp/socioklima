'use client';

import { Tooltip } from 'flowbite-react';
import { useQuestionnaireContext } from '../../components/questionnaireContextProvider';
import { useTranslations } from 'next-intl';
import { HiInformationCircle } from 'react-icons/hi2';

export default function QuestionnaireNavbar() {
  const { name, setShowDescDialog } = useQuestionnaireContext();
  const t = useTranslations('questionnaires');

  return (
    <>
      <div className="w-full flex px-5 py-2 bg-white items-center">
        <span className="text-2xl font-bold">{t(name)}</span>
        <div className="ml-3">
          <Tooltip content={t('general.desc_modal.title')}>
            <HiInformationCircle
              onClick={() => setShowDescDialog(true)}
              className="text-2xl text-purple-500 cursor-pointer"
            />
          </Tooltip>
        </div>
      </div>
    </>
  );
}
