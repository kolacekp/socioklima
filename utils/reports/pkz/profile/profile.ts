import { prisma } from '@/lib/prisma';
import { getResults } from '../../results';
import { Result } from '../../results.model';
import { Categories, Count, Options, PkzOpinionProfileResult } from './profile.model';

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

export const getPkzOpinionProfileResult = async (questionnaireId: string): Promise<PkzOpinionProfileResult | null> => {
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

  const results = await getResults(questionnaireId);
  if (!results) return null;

  const schoolYear =
    (questionnaire.class.license.validUntil.getFullYear() - 1).toString() +
    ' / ' +
    questionnaire.class.license.validUntil.getFullYear().toString();

  const optionsQ1 = initOptions();
  countOptions(results, optionsQ1, undefined, 'pkz.questions.1');
  const categoriesQ1 = initCategories();
  countCategories(results, categoriesQ1, 'pkz.questions.1');
  const optionsQ1Total =
    categoriesQ1.A.total +
    categoriesQ1.B.total +
    categoriesQ1.C.total +
    categoriesQ1.D.total +
    categoriesQ1.E.total +
    categoriesQ1.F.total +
    categoriesQ1.G.total +
    categoriesQ1.H.total +
    categoriesQ1.I.total;
  const chartQ1 = [
    Number(((categoriesQ1.A.total / optionsQ1Total) * 100).toFixed(0)),
    Number(((categoriesQ1.B.total / optionsQ1Total) * 100).toFixed(0)),
    Number(((categoriesQ1.C.total / optionsQ1Total) * 100).toFixed(0)),
    Number(((categoriesQ1.D.total / optionsQ1Total) * 100).toFixed(0)),
    Number(((categoriesQ1.E.total / optionsQ1Total) * 100).toFixed(0)),
    Number(((categoriesQ1.F.total / optionsQ1Total) * 100).toFixed(0)),
    Number(((categoriesQ1.G.total / optionsQ1Total) * 100).toFixed(0)),
    Number(((categoriesQ1.H.total / optionsQ1Total) * 100).toFixed(0)),
    Number(((categoriesQ1.I.total / optionsQ1Total) * 100).toFixed(0))
  ];

  const optionsQ2 = initOptions();
  countOptions(results, optionsQ2, undefined, 'pkz.questions.3');
  const categoriesQ2 = initCategories();
  countCategories(results, categoriesQ2, 'pkz.questions.3');
  const optionsQ2Total =
    categoriesQ2.A.total +
    categoriesQ2.B.total +
    categoriesQ2.C.total +
    categoriesQ2.D.total +
    categoriesQ2.E.total +
    categoriesQ2.F.total +
    categoriesQ2.G.total +
    categoriesQ2.H.total +
    categoriesQ2.I.total;
  const chartQ2 = [
    Number(((categoriesQ2.A.total / optionsQ2Total) * 100).toFixed(0)),
    Number(((categoriesQ2.B.total / optionsQ2Total) * 100).toFixed(0)),
    Number(((categoriesQ2.C.total / optionsQ2Total) * 100).toFixed(0)),
    Number(((categoriesQ2.D.total / optionsQ2Total) * 100).toFixed(0)),
    Number(((categoriesQ2.E.total / optionsQ2Total) * 100).toFixed(0)),
    Number(((categoriesQ2.F.total / optionsQ2Total) * 100).toFixed(0)),
    Number(((categoriesQ2.G.total / optionsQ2Total) * 100).toFixed(0)),
    Number(((categoriesQ2.H.total / optionsQ2Total) * 100).toFixed(0)),
    Number(((categoriesQ2.I.total / optionsQ2Total) * 100).toFixed(0))
  ];

  const optionsQ3 = initOptions();
  countOptions(results, optionsQ3, undefined, 'pkz.questions.3');
  const categoriesQ3 = initCategories();
  countCategories(results, categoriesQ3, 'pkz.questions.3');
  const optionsQ3Total =
    categoriesQ3.A.total +
    categoriesQ3.B.total +
    categoriesQ3.C.total +
    categoriesQ3.D.total +
    categoriesQ3.E.total +
    categoriesQ3.F.total +
    categoriesQ3.G.total +
    categoriesQ3.H.total +
    categoriesQ3.I.total;
  const chartQ3 = [
    Number(((categoriesQ3.A.total / optionsQ3Total) * 100).toFixed(0)),
    Number(((categoriesQ3.B.total / optionsQ3Total) * 100).toFixed(0)),
    Number(((categoriesQ3.C.total / optionsQ3Total) * 100).toFixed(0)),
    Number(((categoriesQ3.D.total / optionsQ3Total) * 100).toFixed(0)),
    Number(((categoriesQ3.E.total / optionsQ3Total) * 100).toFixed(0)),
    Number(((categoriesQ3.F.total / optionsQ3Total) * 100).toFixed(0)),
    Number(((categoriesQ3.G.total / optionsQ3Total) * 100).toFixed(0)),
    Number(((categoriesQ3.H.total / optionsQ3Total) * 100).toFixed(0)),
    Number(((categoriesQ3.I.total / optionsQ3Total) * 100).toFixed(0))
  ];

  const optionsQ4 = initOptions();
  countOptions(results, optionsQ4, undefined, 'pkz.questions.4');
  const categoriesQ4 = initCategories();
  countCategories(results, categoriesQ4, 'pkz.questions.4');
  const optionsQ4Total =
    categoriesQ4.A.total +
    categoriesQ4.B.total +
    categoriesQ4.C.total +
    categoriesQ4.D.total +
    categoriesQ4.E.total +
    categoriesQ4.F.total +
    categoriesQ4.G.total +
    categoriesQ4.H.total +
    categoriesQ4.I.total;
  const chartQ4 = [
    Number(((categoriesQ4.A.total / optionsQ4Total) * 100).toFixed(0)),
    Number(((categoriesQ4.B.total / optionsQ4Total) * 100).toFixed(0)),
    Number(((categoriesQ4.C.total / optionsQ4Total) * 100).toFixed(0)),
    Number(((categoriesQ4.D.total / optionsQ4Total) * 100).toFixed(0)),
    Number(((categoriesQ4.E.total / optionsQ4Total) * 100).toFixed(0)),
    Number(((categoriesQ4.F.total / optionsQ4Total) * 100).toFixed(0)),
    Number(((categoriesQ4.G.total / optionsQ4Total) * 100).toFixed(0)),
    Number(((categoriesQ4.H.total / optionsQ4Total) * 100).toFixed(0)),
    Number(((categoriesQ4.I.total / optionsQ4Total) * 100).toFixed(0))
  ];

  const result: PkzOpinionProfileResult = {
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
          options: optionsQ1,
          categories: categoriesQ1,
          optionsTotal: optionsQ1Total,
          chart: chartQ1
        },
        2: {
          options: optionsQ2,
          categories: categoriesQ2,
          optionsTotal: optionsQ2Total,
          chart: chartQ2
        },
        3: {
          options: optionsQ3,
          categories: categoriesQ3,
          optionsTotal: optionsQ3Total,
          chart: chartQ3
        },
        4: {
          options: optionsQ4,
          categories: categoriesQ4,
          optionsTotal: optionsQ4Total,
          chart: chartQ4
        }
      }
    }
  };

  return result;
};
