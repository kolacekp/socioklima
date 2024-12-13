import { prisma } from '@/lib/prisma';
import { getResults } from '../../results';
import { Result } from '../../results.model';
import { Categories, Count, Options, PkuOpinionProfileResult } from './profile.model';

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
    UA1: createCountStructure(),
    UA2: createCountStructure(),
    UA3: createCountStructure(),
    UA4: createCountStructure(),
    UB1: createCountStructure(),
    UB2: createCountStructure(),
    UB3: createCountStructure(),
    UB4: createCountStructure(),
    UC1: createCountStructure(),
    UC2: createCountStructure(),
    UC3: createCountStructure(),
    UC4: createCountStructure(),
    UD1: createCountStructure(),
    UD2: createCountStructure(),
    UD3: createCountStructure(),
    UD4: createCountStructure(),
    UE1: createCountStructure(),
    UE2: createCountStructure(),
    UE3: createCountStructure(),
    UE4: createCountStructure(),
    UF1: createCountStructure(),
    UF2: createCountStructure(),
    UF3: createCountStructure(),
    UF4: createCountStructure()
  };
};

const initCategories = (): Categories => {
  return {
    UA: createCountStructure(),
    UB: createCountStructure(),
    UC: createCountStructure(),
    UD: createCountStructure(),
    UE: createCountStructure(),
    UF: createCountStructure()
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

export const getPkuOpinionProfileResult = async (questionnaireId: string): Promise<PkuOpinionProfileResult | null> => {
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
  countOptions(results, optionsQ1, undefined, 'pku.questions.1');
  const categoriesQ1 = initCategories();
  countCategories(results, categoriesQ1, 'pku.questions.1');
  const optionsQ1Total =
    categoriesQ1.UA.total +
    categoriesQ1.UB.total +
    categoriesQ1.UC.total +
    categoriesQ1.UD.total +
    categoriesQ1.UE.total +
    categoriesQ1.UF.total;
  const chartQ1 = [
    Number(((categoriesQ1.UA.total / optionsQ1Total) * 100).toFixed(0)),
    Number(((categoriesQ1.UB.total / optionsQ1Total) * 100).toFixed(0)),
    Number(((categoriesQ1.UC.total / optionsQ1Total) * 100).toFixed(0)),
    Number(((categoriesQ1.UD.total / optionsQ1Total) * 100).toFixed(0)),
    Number(((categoriesQ1.UE.total / optionsQ1Total) * 100).toFixed(0)),
    Number(((categoriesQ1.UF.total / optionsQ1Total) * 100).toFixed(0))
  ];

  const optionsQ2 = initOptions();
  countOptions(results, optionsQ2, undefined, 'pku.questions.2');
  const categoriesQ2 = initCategories();
  countCategories(results, categoriesQ2, 'pku.questions.2');
  const optionsQ2Total =
    categoriesQ2.UA.total +
    categoriesQ2.UB.total +
    categoriesQ2.UC.total +
    categoriesQ2.UD.total +
    categoriesQ2.UE.total +
    categoriesQ2.UF.total;
  const chartQ2 = [
    Number(((categoriesQ2.UA.total / optionsQ2Total) * 100).toFixed(0)),
    Number(((categoriesQ2.UB.total / optionsQ2Total) * 100).toFixed(0)),
    Number(((categoriesQ2.UC.total / optionsQ2Total) * 100).toFixed(0)),
    Number(((categoriesQ2.UD.total / optionsQ2Total) * 100).toFixed(0)),
    Number(((categoriesQ2.UE.total / optionsQ2Total) * 100).toFixed(0)),
    Number(((categoriesQ2.UF.total / optionsQ2Total) * 100).toFixed(0))
  ];

  const optionsQ3 = initOptions();
  countOptions(results, optionsQ3, undefined, 'pku.questions.3');
  const categoriesQ3 = initCategories();
  countCategories(results, categoriesQ3, 'pku.questions.3');
  const optionsQ3Total =
    categoriesQ3.UA.total +
    categoriesQ3.UB.total +
    categoriesQ3.UC.total +
    categoriesQ3.UD.total +
    categoriesQ3.UE.total +
    categoriesQ3.UF.total;
  const chartQ3 = [
    Number(((categoriesQ3.UA.total / optionsQ3Total) * 100).toFixed(0)),
    Number(((categoriesQ3.UB.total / optionsQ3Total) * 100).toFixed(0)),
    Number(((categoriesQ3.UC.total / optionsQ3Total) * 100).toFixed(0)),
    Number(((categoriesQ3.UD.total / optionsQ3Total) * 100).toFixed(0)),
    Number(((categoriesQ3.UE.total / optionsQ3Total) * 100).toFixed(0)),
    Number(((categoriesQ3.UF.total / optionsQ3Total) * 100).toFixed(0))
  ];

  const optionsQ4 = initOptions();
  countOptions(results, optionsQ4, undefined, 'pku.questions.4');
  const categoriesQ4 = initCategories();
  countCategories(results, categoriesQ4, 'pku.questions.4');
  const optionsQ4Total =
    categoriesQ4.UA.total +
    categoriesQ4.UB.total +
    categoriesQ4.UC.total +
    categoriesQ4.UD.total +
    categoriesQ4.UE.total +
    categoriesQ4.UF.total;
  const chartQ4 = [
    Number(((categoriesQ4.UA.total / optionsQ4Total) * 100).toFixed(0)),
    Number(((categoriesQ4.UB.total / optionsQ4Total) * 100).toFixed(0)),
    Number(((categoriesQ4.UC.total / optionsQ4Total) * 100).toFixed(0)),
    Number(((categoriesQ4.UD.total / optionsQ4Total) * 100).toFixed(0)),
    Number(((categoriesQ4.UE.total / optionsQ4Total) * 100).toFixed(0)),
    Number(((categoriesQ4.UF.total / optionsQ4Total) * 100).toFixed(0))
  ];

  const result: PkuOpinionProfileResult = {
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
