'use client';

import { AnswerOptionType } from '@/models/questionnaires/answerOptionTypes.enum';
import { Question } from 'models/questionnaires/questionnaire.model';
import OptionImage from './optionImage';
import { PupilDto } from '../models/pupilDto';
import OptionClassmate from './optionClassmate';
import { Answer, AnswerQuestion } from '@/models/questionnaires/answer.model';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import OptionText from './optionText';

function shuffleArray(array: any[]) {
  const newArray = cloneDeep(array);
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const getIsCompleted = (answerQuestion: AnswerQuestion, question: Question, pupils: PupilDto[]) => {
  let isCompleted = true;

  if (question.answerForAllClassmates && answerQuestion.answers.length < pupils.length) {
    isCompleted = false;
  }

  answerQuestion.answers.forEach((answer) => {
    if (answer.options.length > 0) {
      if (question.selectOptionsMin && answer.options.length < question.selectOptionsMin) {
        isCompleted = false;
      }

      if (question.selectOptionsMax && answer.options.length > question.selectOptionsMax) {
        isCompleted = false;
      }
    } else {
      isCompleted = false;
    }
  });
  return isCompleted;
};

export default function AnswerOption({
  question,
  answer,
  setAnswer,
  setAnswers,
  pupils
}: {
  question: Question;
  answer: Answer;
  setAnswer: Dispatch<SetStateAction<Answer | null>>;
  setAnswers: Dispatch<SetStateAction<AnswerQuestion[]>>;
  pupils: PupilDto[];
}) {
  const [answerOptions, setAnswerOptions] = useState(question.answerOptions);
  const t = useTranslations('questionnaires');

  useEffect(() => {
    setAnswerOptions(shuffleArray(question.answerOptions));
  }, [question, answer.pupilId]);

  const isSelected = (value: string) => {
    return answer.options.includes(value);
  };

  const setIsCompleted = () => {
    setAnswers((answerQuestions) => {
      const newAnswers = cloneDeep(answerQuestions);
      newAnswers.map((a) => {
        if (a.questionId === answer.questionId) {
          a.isCompleted = getIsCompleted(a, question, pupils);
        }
      });
      return newAnswers;
    });
  };

  const handleOptionSelect = (value: string, optionType: number) => {
    const newAnswer = { ...answer };
    newAnswer.optionType = optionType;

    if (newAnswer.options.includes(value)) {
      newAnswer.options.splice(newAnswer.options.indexOf(value), 1);
      setIsCompleted();
    } else {
      if (value !== '0' && newAnswer.options.includes('0')) {
        newAnswer.options.splice(newAnswer.options.indexOf('0'), 1);
      }

      if (value == '0') {
        newAnswer.options = [];
        newAnswer.options[0] = value;
      } else {
        if (question.selectOptionsMax && answer.options.length >= question.selectOptionsMax) {
          if (question.selectOptionsMax === 1) {
            newAnswer.options[0] = value;
            setIsCompleted();
            return;
          } else {
            toast.error(t('general.too_many_options') + question.selectOptionsMax);
            return;
          }
        } else {
          newAnswer.options.push(value);
        }
      }
    }

    setAnswer(newAnswer);
    setAnswers((answers) => {
      const newAnswers = cloneDeep(answers);

      newAnswers.map((a) => {
        if (a.questionId === answer.questionId) {
          if (newAnswer.pupilId) {
            const index = a.answers.findIndex((a) => a.pupilId === newAnswer.pupilId);
            index > -1 ? (a.answers[index] = newAnswer) : a.answers.push(newAnswer);
          } else {
            a.answers[0] = newAnswer;
          }
        }
      });

      return newAnswers;
    });
    setIsCompleted();
  };

  const nobody = {
    id: '0',
    user: {
      name: t('general.nobody')
    }
  };

  if (answerOptions.length <= 0) return <></>;

  return (
    <>
      {answerOptions[0].type === AnswerOptionType.CLASSMATE && (
        <div className="flex flex-wrap">
          {pupils.map((pupil) => (
            <OptionClassmate
              key={pupil.id}
              pupil={pupil}
              isSelected={isSelected(pupil.id)}
              handleOptionSelect={handleOptionSelect}
            />
          ))}
          <OptionClassmate
            key={nobody.id}
            pupil={nobody}
            isSelected={isSelected(nobody.id)}
            handleOptionSelect={handleOptionSelect}
          />
        </div>
      )}
      {answerOptions[0].type === AnswerOptionType.IMAGE && (
        <div className="grid auto-rows-[10rem] grid-cols-[repeat(auto-fit,_minmax(10rem,_1fr))] gap-3">
          {answerOptions.map((option) => (
            <OptionImage
              key={option.id}
              option={option}
              isSelected={isSelected(option.id)}
              handleOptionSelect={handleOptionSelect}
            />
          ))}
        </div>
      )}
      {answerOptions[0].type === AnswerOptionType.TEXT && (
        <div className="flex flex-wrap">
          {answerOptions.map((option) => (
            <OptionText
              key={option.id}
              option={option}
              isSelected={isSelected(option.id)}
              handleOptionSelect={handleOptionSelect}
            />
          ))}
        </div>
      )}
    </>
  );
}
