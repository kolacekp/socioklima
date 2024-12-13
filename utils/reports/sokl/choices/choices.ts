import { prisma } from '@/lib/prisma';
import { Options, PupilOptions, SoklChoicesSummaryResult } from './choices.model';
import { getResults } from '../../results';
import { Result } from '../../results.model';
import { getReportPupilName } from '../../getReportPupilName';

const initOptions = (): Options => {
  return {
    A1: 0,
    A2: 0,
    A3: 0,
    B1: 0,
    B2: 0,
    B3: 0,
    C1: 0,
    C2: 0,
    C3: 0,
    D1: 0,
    D2: 0,
    D3: 0,
    E1: 0,
    E2: 0,
    E3: 0,
    F1: 0,
    F2: 0,
    F3: 0,
    G1: 0,
    G2: 0,
    G3: 0,
    H1: 0,
    H2: 0,
    H3: 0,
    I1: 0,
    I2: 0,
    I3: 0
  };
};

const countOptions = (
  results: Result[],
  options: Options,
  pupilId?: string,
  questionName?: string,
  hasTargetPupil?: boolean,
  targetPupilId?: string
) => {
  results.forEach((result) => {
    if (!pupilId || result.pupil.id === pupilId) {
      result.questions.forEach((question) => {
        if (!questionName || question.name === questionName) {
          if (!hasTargetPupil || (hasTargetPupil && question.pupil)) {
            if (!targetPupilId || question.pupil.id === targetPupilId) {
              question.answers.forEach((answer) => {
                if (isKeyOfOptions(answer.value, options)) {
                  options[answer.value]++;
                }
              });
            }
          }
        }
      });
    }
  });
};

const isKeyOfOptions = (value: string, options: Options): value is keyof Options => {
  return Object.keys(options).includes(value);
};

export const getSoklChoicesSummaryResult = async (
  questionnaireId: string
): Promise<SoklChoicesSummaryResult | null> => {
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
          pupilId: true
        }
      }
    }
  });
  if (!questionnaire) return null;

  const results = await getResults(questionnaireId);
  if (!results) return null;

  const schoolYear =
    (questionnaire.class.license.validUntil.getFullYear() - 1).toString() +
    ' / ' +
    questionnaire.class.license.validUntil.getFullYear().toString();

  const pupils = results.map((result) => result.pupil);

  const choices: PupilOptions[] = pupils.map((pupil) => {
    const options = initOptions();
    countOptions(results, options, undefined, 'sokl.questions.8', true, pupil.id);
    return {
      pupilId: pupil.id,
      name: getReportPupilName(pupil, questionnaire),
      number: pupil.number,
      options: options
    };
  });

  const optionsSummary = initOptions();
  Object.keys(optionsSummary).forEach((key) => {
    optionsSummary[key as keyof Options] = choices.reduce((acc, cur) => acc + cur.options[key as keyof Options], 0);
  });

  const choicesResult: SoklChoicesSummaryResult = {
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
      table: {
        pupilOptions: choices,
        optionsSummary: optionsSummary
      }
    }
  };

  return choicesResult;
};
