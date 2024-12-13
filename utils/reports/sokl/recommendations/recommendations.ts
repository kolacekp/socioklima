import { prisma } from '@/lib/prisma';
import { getResults } from '../../results';
import { Count, Options, PupilFactors } from './recommendations.model';
import { Result } from '../../results.model';
import { SoklRecommendationsResult } from './recommendations.model';
import { getReportPupilName } from '../../getReportPupilName';

const createCountStructure = (): Count => {
  return {
    total: 0,
    gender: {
      1: 0,
      2: 0,
      3: 0
    }
  };
};

const initOptions = (): Options => {
  return {
    A1: createCountStructure(),
    A2: createCountStructure(),
    A3: createCountStructure(),
    B1: createCountStructure(),
    B2: createCountStructure(),
    B3: createCountStructure(),
    C1: createCountStructure(),
    C2: createCountStructure(),
    C3: createCountStructure(),
    D1: createCountStructure(),
    D2: createCountStructure(),
    D3: createCountStructure(),
    E1: createCountStructure(),
    E2: createCountStructure(),
    E3: createCountStructure(),
    F1: createCountStructure(),
    F2: createCountStructure(),
    F3: createCountStructure(),
    G1: createCountStructure(),
    G2: createCountStructure(),
    G3: createCountStructure(),
    H1: createCountStructure(),
    H2: createCountStructure(),
    H3: createCountStructure(),
    I1: createCountStructure(),
    I2: createCountStructure(),
    I3: createCountStructure()
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
                  options[answer.value].total++;
                  if (result.pupil.gender === 1 || result.pupil.gender === 2 || result.pupil.gender === 3) {
                    options[answer.value].gender[result.pupil.gender]++;
                  }
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

const addOptionKeys = (options: Options) => {
  Object.keys(options).forEach((key) => {
    if (isKeyOfOptions(key, options)) {
      options[key].key = key;
    }
  });
};

export const getSoklRecommendationsResult = async (
  questionnaireId: string
): Promise<SoklRecommendationsResult | null> => {
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
        include: {
          pupil: {
            select: {
              id: true
            }
          }
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

  const qrPupils = await prisma.questionnaireResult.findMany({
    where: {
      deletedAt: null,
      questionnaireId: questionnaireId,
      isCompleted: true
    },
    include: {
      pupil: {
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });

  const pupils = qrPupils.map((p) => {
    return {
      id: p.pupil.id,
      name: getReportPupilName(p.pupil, questionnaire),
      number: p.pupil.number
    };
  });

  const pupilsFactors = pupils.map((pupil) => {
    const options = initOptions();
    countOptions(results, options, undefined, 'sokl.questions.8', true, pupil.id);
    addOptionKeys(options);

    const strengths = [
      options.A1,
      options.A2,
      options.A3,
      options.D1,
      options.H1,
      options.H2,
      options.H3,
      options.I1,
      options.I2,
      options.I3
    ]
      .filter((option) => {
        return option.total > 0;
      })
      .sort((a, b) => {
        return b.total - a.total;
      })
      .slice(0, 2)
      .map((option) => option.key as keyof Options);

    const risks = [
      options.B1,
      options.B2,
      options.B3,
      options.C1,
      options.C2,
      options.C3,
      options.D3,
      options.F1,
      options.F2,
      options.F3,
      options.G1,
      options.G2,
      options.G3
    ]
      .filter((option) => {
        return option.total > 2;
      })
      .sort((a, b) => {
        return b.total - a.total;
      })
      .slice(0, 2)
      .map((option) => option.key as keyof Options);

    const threats = [options.D2, options.E1, options.E2, options.E3]
      .filter((option) => {
        return option.total > 0;
      })
      .sort((a, b) => {
        return b.total - a.total;
      })
      .slice(0, 2)
      .map((option) => option.key as keyof Options);

    return {
      pupil: pupil,
      factors: {
        strengths,
        risks,
        threats
      }
    } as PupilFactors;
  });

  const result: SoklRecommendationsResult = {
    info: {
      schoolName: questionnaire.school.schoolName,
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
      pupilsFactors: pupilsFactors
    }
  };

  return result;
};
