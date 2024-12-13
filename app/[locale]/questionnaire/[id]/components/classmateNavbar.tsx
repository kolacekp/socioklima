'use client';

import { useConfirm } from '@/app/components/confirm/confirmProvider';
import { PupilDto } from '../models/pupilDto';
import { Answer } from '@/models/questionnaires/answer.model';
import { Question } from '@/models/questionnaires/questionnaire.model';
import { Button } from 'flowbite-react';
import { Dispatch, SetStateAction } from 'react';
import { useTranslations } from 'next-intl';

const getIsCompleted = (answer: Answer, question: Question) => {
  if (question.selectOptionsMin && answer.options.length < question.selectOptionsMin) {
    return false;
  }

  if (question.selectOptionsMax && answer.options.length > question.selectOptionsMax) {
    return false;
  }

  return true;
};

export default function ClassmateNavbar({
  pupils,
  answer,
  question,
  setPupilId
}: {
  pupils: PupilDto[];
  answer: Answer;
  question: Question;
  setPupilId: Dispatch<SetStateAction<string | undefined>>;
}) {
  const t = useTranslations('questionnaires');
  const { showConfirm } = useConfirm();

  const pupilIdList = pupils.map((p) => p.id);
  const pupil = pupils.find((p) => p.id === answer.pupilId);
  if (!pupil) return null;

  const index = pupilIdList.findIndex((id) => id === answer.pupilId);
  const isFirst = index === 0;
  const isLast = index === pupilIdList.length - 1;
  const isCompleted = getIsCompleted(answer, question);

  const handleNavigateQuestion = (direction: string) => {
    if (direction === 'prev') {
      if (isFirst) return;
      setPupilId(pupilIdList[index - 1]);
    } else if (direction === 'next') {
      if (isLast) return;
      if (question.selectOptionsMax && answer.options.length < question.selectOptionsMax) {
        showConfirm({
          title: t('general.confirm_options_modal.title'),
          confirmMessage:
            t('general.confirm_options_modal.1') + question.selectOptionsMax + t('general.confirm_options_modal.2'),
          onConfirm: () => {
            setPupilId(pupilIdList[index + 1]);
          }
        });
      } else {
        setPupilId(pupilIdList[index + 1]);
      }
    }
  };

  return (
    <div className="flex w-full align-middle mb-4 p-2">
      <div className="flex-1">
        <Button
          onClick={() => handleNavigateQuestion('prev')}
          className="float-right"
          disabled={isFirst}
          outline
          pill
          gradientDuoTone="purpleToBlue"
        >
          {t('general.prev_classmate')}
        </Button>
      </div>
      <div className="flex-1 text-center text-xl pt-1">
        <span className="font-bold">{pupil.user.name}</span> ({index + 1}/{pupilIdList.length})
      </div>
      <div className="flex-1">
        <Button
          onClick={() => handleNavigateQuestion('next')}
          className="float-left"
          disabled={isLast || !isCompleted}
          pill
          gradientDuoTone="purpleToBlue"
        >
          {t('general.next_classmate')}
        </Button>
      </div>
    </div>
  );
}
