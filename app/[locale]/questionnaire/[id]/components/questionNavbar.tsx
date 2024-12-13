'use client';

import { AnswerQuestion } from '@/models/questionnaires/answer.model';
import { Question } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { useQuestionnaireContext } from '../../components/questionnaireContextProvider';
import { Button } from 'flowbite-react';
import { ResultAnswersDto } from '@/models/questionnaires/resultAnswersDto';
import { toast } from 'react-hot-toast';
import { useConfirm } from '@/app/components/confirm/confirmProvider';
import { useState } from 'react';

export default function QuestionNavbar({ question, answers }: { question: Question; answers: AnswerQuestion[] }) {
  const t = useTranslations('questionnaires');
  const {
    questionnaireId,
    navigateQuestion,
    navigateNextPart,
    partList,
    questionList,
    currentPartId,
    currentQuestionId
  } = useQuestionnaireContext();
  const { showConfirm } = useConfirm();
  const [isLoading, setIsLoading] = useState(false);

  const isCompleted = () => {
    const answer = answers.find((a) => a.questionId === question.id);
    return answer?.isCompleted || false;
  };

  const isFirst = () => {
    if (currentQuestionId === questionList[0]) {
      return true;
    }
    return false;
  };

  const isLast = () => {
    if (currentQuestionId === questionList[questionList.length - 1]) {
      return true;
    }
    return false;
  };

  const isLastPart = () => {
    if (currentPartId === partList[partList.length - 1]) {
      return true;
    }
    return false;
  };

  const handleNavigateQuestion = (direction: string) => {
    if (direction === 'next') {
      const answerQuestion = answers.find((a) => a.questionId === question.id);
      if (!answerQuestion) return navigateQuestion(direction);

      if (question.hasAnswerOptions && question.selectOptionsMax) {
        if (
          answerQuestion.answers.length === 1 &&
          answerQuestion.answers[0].options.length < question.selectOptionsMax
        ) {
          return showConfirm({
            title: t('general.confirm_options_modal.title'),
            confirmMessage:
              t('general.confirm_options_modal.1') + question.selectOptionsMax + t('general.confirm_options_modal.2'),
            onConfirm: () => {
              navigateQuestion(direction);
            }
          });
        } else {
          navigateQuestion(direction);
        }
      } else {
        navigateQuestion(direction);
      }
    } else {
      navigateQuestion(direction);
    }
  };

  const submitPart = async (isQCompleted: boolean) => {
    setIsLoading(true);
    const partAnswers = answers.filter((a) => a.partId === currentPartId).flatMap((a) => a.answers);

    if (partAnswers.length === 0) {
      toast.error(t('general.answers_save_failed'));
      setIsLoading(false);
      return;
    }

    const answersDto: ResultAnswersDto = {
      questionnaireId: questionnaireId,
      partId: currentPartId,
      isCompleted: isQCompleted,
      answers: partAnswers
    };

    const res = await fetch(`/api/results/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(answersDto)
    });

    if (res.ok) {
      toast.success(t('general.answers_saved'));
      navigateNextPart();
    } else {
      setIsLoading(false);
      const data = (await res.json()) as { partAlreadyCompleted?: boolean };
      if (data.partAlreadyCompleted) {
        toast.error(t('general.part_already_completed'));
        navigateNextPart();
      } else {
        toast.error(t('general.answers_save_failed'));
      }
      return;
    }

    setIsLoading(false);
    return;
  };

  const handleSubmitPart = (isQCompleted: boolean) => {
    showConfirm({
      title: t('general.submit_part_modal.title'),
      confirmMessage: t('general.submit_part_modal.message'),
      async onConfirm() {
        void submitPart(isQCompleted);
      }
    });
  };

  const partIndex = partList.findIndex((p) => p === currentPartId);
  const questionIndex = questionList.findIndex((q) => q === currentQuestionId);

  return (
    <>
      <div>
        {t('general.part')} {partIndex + 1}/{partList.length}
      </div>
      <div className="flex w-full justify-between align-top mb-4">
        <h4 className="text-2xl">
          {t('general.question')} {questionIndex + 1}/{questionList.length}:{' '}
          <span className="font-bold">{t(question.name)}</span>
        </h4>
        <div className="inline-flex gap-2">
          <Button
            onClick={() => handleNavigateQuestion('prev')}
            disabled={isFirst()}
            outline
            pill
            gradientDuoTone="purpleToBlue"
          >
            {t('general.prev_question')}
          </Button>
          {isLast() ? (
            <>
              {isLastPart() ? (
                <Button
                  onClick={() => handleSubmitPart(true)}
                  disabled={!isCompleted() || isLoading}
                  isProcessing={isLoading}
                  pill
                  gradientDuoTone="purpleToBlue"
                >
                  {t('general.finalize_questionnaire')}
                </Button>
              ) : (
                <Button
                  onClick={() => handleSubmitPart(false)}
                  disabled={!isCompleted() || isLoading}
                  isProcessing={isLoading}
                  pill
                  gradientDuoTone="purpleToBlue"
                >
                  {t('general.next_part')}
                </Button>
              )}
            </>
          ) : (
            <Button
              onClick={() => handleNavigateQuestion('next')}
              disabled={!isCompleted()}
              pill
              gradientDuoTone="purpleToBlue"
            >
              {t('general.next_question')}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
