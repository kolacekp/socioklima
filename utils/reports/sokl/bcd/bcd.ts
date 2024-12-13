import { prisma } from '@/lib/prisma';
import { getResults } from '../../results';
import { BcdResult, Categories, Count, Options, IndexTiers } from './bcd.model';
import { Result } from '../../results.model';

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

const initCategories = (): Categories => {
  return {
    A: createCountStructure(),
    B: createCountStructure(),
    C: createCountStructure(),
    D: createCountStructure(),
    E: createCountStructure(),
    F: createCountStructure(),
    G: createCountStructure(),
    H: createCountStructure(),
    I: createCountStructure()
  };
};

const countOptions = (
  results: Result[],
  options: Options,
  pupilId?: string,
  questionName?: string,
  hasTargetPupil?: boolean
) => {
  results.forEach((result) => {
    if (!pupilId || result.pupil.id === pupilId) {
      result.questions.forEach((question) => {
        if (!questionName || question.name === questionName) {
          question.answers.forEach((answer) => {
            if (isKeyOfOptions(answer.value, options)) {
              options[answer.value].total++;
              if (hasTargetPupil && question.pupil) {
                if (question.pupil.gender === 1 || question.pupil.gender === 2 || question.pupil.gender === 3) {
                  options[answer.value].gender[question.pupil.gender]++;
                }
              } else {
                if (result.pupil.gender === 1 || result.pupil.gender === 2 || result.pupil.gender === 3) {
                  options[answer.value].gender[result.pupil.gender]++;
                }
              }
            }
          });
        }
      });
    }
  });
};

const countCategories = (
  results: Result[],
  categories: Categories,
  questionName?: string,
  hasTargetPupil?: boolean
) => {
  results.forEach((result) => {
    result.questions.forEach((question) => {
      if (!questionName || question.name === questionName) {
        question.answers.forEach((answer) => {
          if (answer.category && isKeyOfCategories(answer.category, categories)) {
            categories[answer.category].total++;
            if (hasTargetPupil && question.pupil) {
              if (question.pupil.gender === 1 || question.pupil.gender === 2 || question.pupil.gender === 3) {
                categories[answer.category].gender[question.pupil.gender]++;
              }
            } else {
              if (result.pupil.gender === 1 || result.pupil.gender === 2 || result.pupil.gender === 3) {
                categories[answer.category].gender[result.pupil.gender]++;
              }
            }
          }
        });
      }
    });
  });
};

const isKeyOfOptions = (value: string, options: Options): value is keyof Options => {
  return Object.keys(options).includes(value);
};

const isKeyOfCategories = (value: string, categories: Categories): value is keyof Categories => {
  return Object.keys(categories).includes(value);
};

const isKeyOfIndexes = (value: number, indexes: IndexTiers): value is keyof IndexTiers => {
  return Object.keys(indexes).includes(value.toString());
};

export const getSoklBcdResult = async (questionnaireId: string): Promise<BcdResult | null> => {
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

  const optionsAll = initOptions();
  countOptions(results, optionsAll, undefined, 'sokl.questions.8');

  const categoriesAll: Categories = {
    A: {
      total: optionsAll.A1.total + optionsAll.A2.total + optionsAll.A3.total,
      gender: {
        1: optionsAll.A1.gender[1] + optionsAll.A2.gender[1] + optionsAll.A3.gender[1],
        2: optionsAll.A1.gender[2] + optionsAll.A2.gender[2] + optionsAll.A3.gender[2],
        3: optionsAll.A1.gender[3] + optionsAll.A2.gender[3] + optionsAll.A3.gender[3]
      }
    },
    B: {
      total: optionsAll.B1.total + optionsAll.B2.total + optionsAll.B3.total,
      gender: {
        1: optionsAll.B1.gender[1] + optionsAll.B2.gender[1] + optionsAll.B3.gender[1],
        2: optionsAll.B1.gender[2] + optionsAll.B2.gender[2] + optionsAll.B3.gender[2],
        3: optionsAll.B1.gender[3] + optionsAll.B2.gender[3] + optionsAll.B3.gender[3]
      }
    },
    C: {
      total: optionsAll.C1.total + optionsAll.C2.total + optionsAll.C3.total,
      gender: {
        1: optionsAll.C1.gender[1] + optionsAll.C2.gender[1] + optionsAll.C3.gender[1],
        2: optionsAll.C1.gender[2] + optionsAll.C2.gender[2] + optionsAll.C3.gender[2],
        3: optionsAll.C1.gender[3] + optionsAll.C2.gender[3] + optionsAll.C3.gender[3]
      }
    },
    D: {
      total: optionsAll.D1.total + optionsAll.D2.total + optionsAll.D3.total,
      gender: {
        1: optionsAll.D1.gender[1] + optionsAll.D2.gender[1] + optionsAll.D3.gender[1],
        2: optionsAll.D1.gender[2] + optionsAll.D2.gender[2] + optionsAll.D3.gender[2],
        3: optionsAll.D1.gender[3] + optionsAll.D2.gender[3] + optionsAll.D3.gender[3]
      }
    },
    E: {
      total: optionsAll.E1.total + optionsAll.E2.total + optionsAll.E3.total,
      gender: {
        1: optionsAll.E1.gender[1] + optionsAll.E2.gender[1] + optionsAll.E3.gender[1],
        2: optionsAll.E1.gender[2] + optionsAll.E2.gender[2] + optionsAll.E3.gender[2],
        3: optionsAll.E1.gender[3] + optionsAll.E2.gender[3] + optionsAll.E3.gender[3]
      }
    },
    F: {
      total: optionsAll.F1.total + optionsAll.F2.total + optionsAll.F3.total,
      gender: {
        1: optionsAll.F1.gender[1] + optionsAll.F2.gender[1] + optionsAll.F3.gender[1],
        2: optionsAll.F1.gender[2] + optionsAll.F2.gender[2] + optionsAll.F3.gender[2],
        3: optionsAll.F1.gender[3] + optionsAll.F2.gender[3] + optionsAll.F3.gender[3]
      }
    },
    G: {
      total: optionsAll.G1.total + optionsAll.G2.total + optionsAll.G3.total,
      gender: {
        1: optionsAll.G1.gender[1] + optionsAll.G2.gender[1] + optionsAll.G3.gender[1],
        2: optionsAll.G1.gender[2] + optionsAll.G2.gender[2] + optionsAll.G3.gender[2],
        3: optionsAll.G1.gender[3] + optionsAll.G2.gender[3] + optionsAll.G3.gender[3]
      }
    },
    H: {
      total: optionsAll.H1.total + optionsAll.H2.total + optionsAll.H3.total,
      gender: {
        1: optionsAll.H1.gender[1] + optionsAll.H2.gender[1] + optionsAll.H3.gender[1],
        2: optionsAll.H1.gender[2] + optionsAll.H2.gender[2] + optionsAll.H3.gender[2],
        3: optionsAll.H1.gender[3] + optionsAll.H2.gender[3] + optionsAll.H3.gender[3]
      }
    },
    I: {
      total: optionsAll.I1.total + optionsAll.I2.total + optionsAll.I3.total,
      gender: {
        1: optionsAll.I1.gender[1] + optionsAll.I2.gender[1] + optionsAll.I3.gender[1],
        2: optionsAll.I1.gender[2] + optionsAll.I2.gender[2] + optionsAll.I3.gender[2],
        3: optionsAll.I1.gender[3] + optionsAll.I2.gender[3] + optionsAll.I3.gender[3]
      }
    }
  };

  const optionsTotal =
    categoriesAll.A.total +
    categoriesAll.B.total +
    categoriesAll.C.total +
    categoriesAll.D.total +
    categoriesAll.E.total +
    categoriesAll.F.total +
    categoriesAll.G.total +
    categoriesAll.H.total +
    categoriesAll.I.total;

  const categoriesQ1 = initCategories();
  countCategories(results, categoriesQ1, 'sokl.questions.1');

  const categoriesQ2 = initCategories();
  countCategories(results, categoriesQ2, 'sokl.questions.2');

  const categoriesQ3 = initCategories();
  countCategories(results, categoriesQ3, 'sokl.questions.3');

  const categoriesQ4 = initCategories();
  countCategories(results, categoriesQ4, 'sokl.questions.4');

  const categoriesQ8A = initCategories();
  countCategories(results, categoriesQ8A, 'sokl.questions.8', true);

  const categoriesQ8B = categoriesAll;

  const bcdResult: BcdResult = {
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
        optionsTotal: optionsTotal,
        categories: categoriesAll,
        options: optionsAll
      },
      charts: {
        reviewObtainedChart: categoriesQ8A,
        reviewGivenChart: categoriesQ8B,
        doughnutChart: [
          Number(((categoriesAll.A.total / optionsTotal) * 100).toFixed(0)),
          Number(((categoriesAll.B.total / optionsTotal) * 100).toFixed(0)),
          Number(((categoriesAll.C.total / optionsTotal) * 100).toFixed(0)),
          Number(((categoriesAll.D.total / optionsTotal) * 100).toFixed(0)),
          Number(((categoriesAll.E.total / optionsTotal) * 100).toFixed(0)),
          Number(((categoriesAll.F.total / optionsTotal) * 100).toFixed(0)),
          Number(((categoriesAll.G.total / optionsTotal) * 100).toFixed(0)),
          Number(((categoriesAll.H.total / optionsTotal) * 100).toFixed(0)),
          Number(((categoriesAll.I.total / optionsTotal) * 100).toFixed(0))
        ],
        reviewMeToMyselfChart: categoriesQ1,
        reviewOthersToMyselfChart: categoriesQ2,
        idealMeChart: categoriesQ3,
        rejectedMeChart: categoriesQ4
      }
    }
  };

  return bcdResult;
};
