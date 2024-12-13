'use client';

import { AnswerQuestion } from 'models/questionnaires/answer.model';
import { QuestionnaireType } from 'models/questionnaires/questionnaire.model';
import { useState } from 'react';
import QuestionBlock from './questionBlock';
import { PupilDto } from '../models/pupilDto';
import { useQuestionnaireContext } from '../../components/questionnaireContextProvider';
import QuestionNavbar from './questionNavbar';
import DescriptionModal from './descriptionModal';

export default function Questionnaire({
  questionnaire,
  pupils,
  answersInit
}: {
  questionnaire: QuestionnaireType;
  pupils: PupilDto[];
  answersInit: AnswerQuestion[];
}) {
  const { currentPartId, currentQuestionId } = useQuestionnaireContext();
  const [answers, setAnswers] = useState(answersInit);

  const currentPart = questionnaire.questionnaireParts.find((part) => part.id === currentPartId);

  const currentQuestion = currentPart?.questions.find((question) => question.id === currentQuestionId);

  return (
    <>
      <div className="mx-5">
        {currentQuestion && (
          <>
            <QuestionNavbar question={currentQuestion} answers={answers} />
            <QuestionBlock
              question={currentQuestion}
              answers={answers}
              setAnswers={setAnswers}
              pupils={pupils}
              partDescription={currentPart?.description}
            />
          </>
        )}
      </div>
      <DescriptionModal questionnaire={questionnaire} />
    </>
  );
}
