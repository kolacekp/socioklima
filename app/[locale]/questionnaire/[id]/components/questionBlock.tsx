'use client';

import { Alert, Label, Textarea } from 'flowbite-react';
import { cloneDeep } from 'lodash';
import { Answer, AnswerQuestion } from 'models/questionnaires/answer.model';
import { Question } from 'models/questionnaires/questionnaire.model';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import AnswerOption from './answerOption';
import { HiOutlineInformationCircle } from 'react-icons/hi2';
import { PupilDto } from '../models/pupilDto';
import { useTranslations } from 'next-intl';
import ClassmateNavbar from './classmateNavbar';

const getAnswer = (question: Question, answers: AnswerQuestion[], currentPupilId?: string) => {
  const answerQuestion = answers.find((answer) => answer.questionId === question.id);

  if (!answerQuestion) return null;

  // If answers empty, create new answer
  if (answerQuestion.answers.length <= 0) return new Answer(question.id, currentPupilId);

  // If answer for all classmates, return answer or create new
  if (question.answerForAllClassmates && currentPupilId) {
    const answer = answerQuestion.answers.find((a) => a.pupilId === currentPupilId);
    return answer || new Answer(question.id, currentPupilId);
  }

  // Return first answer
  return answerQuestion.answers[0];
};

const getPupilId = (question: Question, pupils: PupilDto[]) => {
  if (question.answerForAllClassmates && pupils.length > 0) {
    return pupils[0].id;
  }
  return undefined;
};

export default function QuestionBlock({
  question,
  answers,
  setAnswers,
  pupils,
  partDescription
}: {
  question: Question;
  answers: AnswerQuestion[];
  setAnswers: Dispatch<SetStateAction<AnswerQuestion[]>>;
  pupils: PupilDto[];
  partDescription?: string | null;
}) {
  const [pupilId, setPupilId] = useState(getPupilId(question, pupils));
  const [answer, setAnswer] = useState(getAnswer(question, answers, pupilId));
  const t = useTranslations('questionnaires');

  useEffect(() => {
    setPupilId(getPupilId(question, pupils));
  }, [question, pupils]);

  useEffect(() => {
    if (question.answerForAllClassmates && !pupilId) return;
    setAnswer(getAnswer(question, answers, pupilId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, pupilId]);

  if (!answer || answer.questionId !== question.id) return <></>;

  const handleCommentInput = (comment: string) => {
    const newAnswer = { ...answer };
    newAnswer.comment = comment;

    setAnswer(newAnswer);
    setAnswers((answers) => {
      const newAnswers = cloneDeep(answers);

      newAnswers.map((a) => {
        if (a.questionId === answer.questionId) {
          const index = a.answers.findIndex((a) => a.pupilId === pupilId);
          index > -1 ? (a.answers[index] = newAnswer) : a.answers.push(newAnswer);
        }
      });

      return newAnswers;
    });
  };

  return (
    <>
      {partDescription && (
        <div className="w-auto mb-6">
          <Alert icon={HiOutlineInformationCircle}>{t(partDescription)}</Alert>
        </div>
      )}

      {question.answerForAllClassmates && (
        <ClassmateNavbar pupils={pupils} answer={answer} question={question} setPupilId={setPupilId} />
      )}

      {question.hasAnswerOptions && (
        <AnswerOption
          question={question}
          answer={answer}
          setAnswer={setAnswer}
          setAnswers={setAnswers}
          pupils={pupils}
        />
      )}

      {question.enableComment && (
        <div className="mt-8">
          <Label htmlFor="comment" value={t('general.comment')} className="mb-2 block text-md font-bold" />
          <Textarea id="comment" value={answer.comment || ''} onChange={(e) => handleCommentInput(e.target.value)} />
        </div>
      )}
    </>
  );
}
