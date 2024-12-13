import { prisma } from '@/lib/prisma';
import { Answer, Pupil, Question, Result } from './results.model';

export const getResults = async (questionnaireId: string): Promise<Result[]> => {
  const questionnaire = await prisma.questionnaire.findFirst({
    where: {
      id: questionnaireId
    },
    select: {
      classId: true
    }
  });
  if (!questionnaire) return [];

  const questionnaireResults = await prisma.questionnaireResult.findMany({
    where: {
      questionnaireId: questionnaireId,
      deletedAt: null,
      isCompleted: true
    },
    include: {
      questionnaireResultAnswers: {
        include: {
          question: true,
          answerOptions: true,
          answerPupils: true
        }
      },
      pupil: {
        select: {
          gender: true
        }
      }
    }
  });

  const pupils = await prisma.pupil.findMany({
    where: {
      classId: questionnaire.classId
    },
    include: {
      user: {
        select: {
          name: true
        }
      }
    }
  });

  const results: Result[] = questionnaireResults.map((res) => {
    return {
      id: res.id,
      pupil: pupils.find((pupil) => pupil.id === res.pupilId) as Pupil,
      questions: res.questionnaireResultAnswers.map((answer) => {
        return {
          id: answer.id,
          questionId: answer.questionId,
          pupil: pupils.find((pupil) => pupil.id === answer.pupilId) as Pupil,
          name: answer.question.name,
          order: answer.question.order,
          comment: answer.comment,
          classmates: answer.answerPupils.map((pupil) => {
            return pupil.id;
          }),
          answers: answer.answerOptions.map((option) => {
            return {
              id: option.id,
              type: option.type,
              value: option.value,
              category: option.category
            };
          }) as Answer[]
        };
      }) as Question[]
    } as Result;
  });

  return results;
};
