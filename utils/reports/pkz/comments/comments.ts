import { prisma } from '@/lib/prisma';
import { getResults } from '../../results';
import { Result } from '../../results.model';
import { PkzCommentsResult } from './comments.model';

const countComments = (results: Result[], questionName?: string) => {
  const comments: string[] = [];

  results.forEach((result) => {
    result.questions.forEach((question) => {
      if (!questionName || question.name === questionName) {
        if (question.comment) comments.push(question.comment);
      }
    });
  });

  return comments;
};

export const getPkzCommentsResult = async (questionnaireId: string): Promise<PkzCommentsResult | null> => {
  const questionnaire = await prisma.questionnaire.findFirst({
    where: {
      id: questionnaireId,
      deletedAt: null
    },
    include: {
      school: {
        select: {
          schoolName: true
        }
      },
      class: {
        include: {
          license: {
            select: {
              validUntil: true
            }
          }
        }
      },
      questionnaireType: {
        select: {
          name: true,
          shortName: true
        }
      },
      PupilToQuestionnaire: {
        where: {
          deletedAt: null
        },
        select: {
          id: true
        }
      }
    }
  });
  if (!questionnaire) return null;

  const results: Result[] = await getResults(questionnaireId);
  if (!results) return null;

  const schoolYear =
    (questionnaire.class.license.validUntil.getFullYear() - 1).toString() +
    ' / ' +
    questionnaire.class.license.validUntil.getFullYear().toString();

  const commentsQ1 = countComments(results, 'pkz.questions.1');
  const commentsQ2 = countComments(results, 'pkz.questions.2');
  const commentsQ3 = countComments(results, 'pkz.questions.3');
  const commentsQ4 = countComments(results, 'pkz.questions.4');

  const result: PkzCommentsResult = {
    info: {
      schoolName: questionnaire.school.schoolName,
      questionnaireName: questionnaire.questionnaireType.name,
      questionnaireShortName: questionnaire.questionnaireType.shortName,
      className: questionnaire.class.name,
      schoolYear: schoolYear,
      pupilsTotal: questionnaire.PupilToQuestionnaire.length,
      pupilsCompleted: results.length,
      dateCreated: questionnaire.createdAt,
      dateClosed: questionnaire.closedAt,
      genderRequired: questionnaire.class.genderRequired,
      nationalityRequired: false
    },
    results: {
      questions: {
        1: {
          comments: commentsQ1
        },
        2: {
          comments: commentsQ2
        },
        3: {
          comments: commentsQ3
        },
        4: {
          comments: commentsQ4
        }
      }
    }
  };

  return result;
};
