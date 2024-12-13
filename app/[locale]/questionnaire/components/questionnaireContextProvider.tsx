'use client';

import { QuestionnaireType } from '@/models/questionnaires/questionnaire.model';
import React, { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react';

const getQuestionsIds = (questionnaire: QuestionnaireType, currentPartId: string) => {
  const part = questionnaire.questionnaireParts.find((part) => part.id === currentPartId);

  if (part) {
    const questions = part.questions.map((question) => question.id);
    return questions;
  } else return [];
};

const getQuestionId = (questionnaire: QuestionnaireType, partId: string) => {
  const question = questionnaire.questionnaireParts.find((part) => part.id === partId)?.questions[0];
  return question?.id;
};

const QuestionnaireContext = createContext<QuestionnaireContextModel>({} as QuestionnaireContextModel);

interface QuestionnaireContextModel {
  name: string;
  questionnaireId: string;
  currentPartId: string;
  currentQuestionId: string;
  setCurrentQuestionId: Dispatch<SetStateAction<string>>;
  navigateQuestion: (direction: string) => void;
  navigateNextPart: () => void;
  partList: string[];
  questionList: string[];
  showDescDialog: boolean;
  setShowDescDialog: Dispatch<SetStateAction<boolean>>;
}

export const QuestionnaireContextProvider = ({
  children,
  questionnaire,
  questionnaireId,
  partList,
  initPartId
}: {
  children: React.ReactNode;
  questionnaire: QuestionnaireType;
  questionnaireId: string;
  partList: string[];
  initPartId: string;
}) => {
  const [showDescDialog, setShowDescDialog] = useState(
    questionnaire.description && questionnaire.linesOfDescription ? true : false
  );
  const [currentPartId, setCurrentPartId] = useState(initPartId);
  const [currentQuestionId, setCurrentQuestionId] = useState(
    getQuestionId(questionnaire, initPartId) || questionnaire.questionnaireParts[0].questions[0].id
  );

  const [questionList, setQuestionList] = useState(
    getQuestionsIds(questionnaire, questionnaire.questionnaireParts[0].id)
  );

  useEffect(() => {
    setQuestionList(getQuestionsIds(questionnaire, currentPartId));
  }, [questionnaire, currentPartId]);

  const navigateQuestion = (direction: string) => {
    const index = questionList.indexOf(currentQuestionId);

    if (direction === 'next' && index < questionList.length - 1) {
      setCurrentQuestionId(questionList[index + 1]);
    } else if (direction === 'prev' && index > 0) {
      setCurrentQuestionId(questionList[index - 1]);
    }
  };

  const navigateNextPart = () => {
    const index = partList.indexOf(currentPartId);
    const partId = partList[index + 1];

    if (index < partList.length - 1) {
      const question = questionnaire.questionnaireParts.find((part) => part.id === partId)?.questions[0];
      if (question) {
        setCurrentPartId(partId);
        setCurrentQuestionId(question.id);
      }
    }

    if (index === partList.length - 1) {
      setTimeout(() => {
        window.location.href = '/dashboard/questionnaires';
      });
    }
  };

  return (
    <QuestionnaireContext.Provider
      value={{
        name: questionnaire.name,
        questionnaireId: questionnaireId,
        currentPartId,
        currentQuestionId,
        setCurrentQuestionId,
        navigateQuestion,
        navigateNextPart,
        partList,
        questionList,
        showDescDialog,
        setShowDescDialog
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
};

export const useQuestionnaireContext = () => useContext(QuestionnaireContext);
