import { prisma } from '@/lib/prisma';
import { getResults } from '../../results';
import {
  SoklDcdResult,
  Categories,
  Count,
  Options,
  PupilOptions,
  OptionsCounts,
  OptionsCountsPupils,
  CategoriesCountsPupils
} from './dcd.model';
import { Result } from '../../results.model';
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

const initOptionCounts = () => {
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

const initOptionCountsPupils = () => {
  return {
    A1: [],
    A2: [],
    A3: [],
    B1: [],
    B2: [],
    B3: [],
    C1: [],
    C2: [],
    C3: [],
    D1: [],
    D2: [],
    D3: [],
    E1: [],
    E2: [],
    E3: [],
    F1: [],
    F2: [],
    F3: [],
    G1: [],
    G2: [],
    G3: [],
    H1: [],
    H2: [],
    H3: [],
    I1: [],
    I2: [],
    I3: []
  };
};

const initCategoriesCountsPupils = () => {
  return {
    A: [],
    B: [],
    C: [],
    D: [],
    E: [],
    F: [],
    G: [],
    H: [],
    I: []
  };
};

const isKeyOfOptionCounts = (value: string, options: OptionsCounts): value is keyof OptionsCounts => {
  return Object.keys(options).includes(value);
};

const countPupilOptions = (result: Result[], pupilId: string) => {
  const optionCounts: OptionsCounts = initOptionCounts();

  result.forEach((result) => {
    result.questions
      .filter((question) => {
        return question.pupil?.id === pupilId;
      })
      .forEach((question) => {
        question.answers.forEach((answer) => {
          if (isKeyOfOptionCounts(answer.value, optionCounts)) {
            optionCounts[answer.value]++;
          }
        });
      });
  });

  return optionCounts;
};

export const getSoklDcdResult = async (questionnaireId: string): Promise<SoklDcdResult | null> => {
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
            include: {
              user: {
                select: {
                  name: true
                }
              }
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

  const pupils = questionnaire.PupilToQuestionnaire.map((ptq) => {
    return {
      id: ptq.pupil.id,
      name: getReportPupilName(ptq.pupil, questionnaire),
      number: ptq.pupil.number
    };
  });

  const pupilOptions = pupils.map((pupil) => {
    const optionCounts = countPupilOptions(results, pupil.id);
    return {
      pupil: pupil,
      options: optionCounts
    } as PupilOptions;
  });

  const optionsCountsPupils: OptionsCountsPupils = initOptionCountsPupils();

  Object.keys(optionsCountsPupils).forEach((key) => {
    pupilOptions.forEach((po) => {
      const value = po.options[key as keyof OptionsCounts];
      if (value) {
        optionsCountsPupils[key as keyof OptionsCountsPupils].push({
          pupil: po.pupil,
          value: value
        });
      }
    });
  });

  Object.keys(optionsCountsPupils).forEach((key) => {
    optionsCountsPupils[key as keyof OptionsCountsPupils].sort((a, b) => {
      return b.value - a.value;
    });
  });

  const categoriesCountsPupils: CategoriesCountsPupils = initCategoriesCountsPupils();

  Object.keys(categoriesCountsPupils).forEach((key) => {
    pupilOptions.forEach((po) => {
      const v1 = po.options[(key + '1') as keyof OptionsCounts];
      const v2 = po.options[(key + '2') as keyof OptionsCounts];
      const v3 = po.options[(key + '3') as keyof OptionsCounts];
      const value = v1 + v2 + v3;
      if (value) {
        categoriesCountsPupils[key as keyof CategoriesCountsPupils].push({
          pupil: po.pupil,
          value: value
        });
      }
    });
  });

  Object.keys(categoriesCountsPupils).forEach((key) => {
    categoriesCountsPupils[key as keyof CategoriesCountsPupils].sort((a, b) => {
      return b.value - a.value;
    });
  });

  addOptionKeys(optionsAll);

  const strengths = [
    optionsAll.A1,
    optionsAll.A2,
    optionsAll.A3,
    optionsAll.D1,
    optionsAll.H1,
    optionsAll.H2,
    optionsAll.H3,
    optionsAll.I1,
    optionsAll.I2,
    optionsAll.I3
  ]
    .sort((a, b) => {
      return b.total - a.total;
    })
    .slice(0, 2)
    .map((option) => option.key as keyof Options);

  const risks = [
    optionsAll.B1,
    optionsAll.B2,
    optionsAll.B3,
    optionsAll.C1,
    optionsAll.C2,
    optionsAll.C3,
    optionsAll.D3,
    optionsAll.F1,
    optionsAll.F2,
    optionsAll.F3,
    optionsAll.G1,
    optionsAll.G2,
    optionsAll.G3
  ]
    .filter((option) => {
      return option.total > 2;
    })
    .sort((a, b) => {
      return b.total - a.total;
    })
    .slice(0, 2)
    .map((option) => option.key as keyof Options);

  const threats = [optionsAll.D2, optionsAll.E1, optionsAll.E2, optionsAll.E3]
    .filter((option) => {
      return option.total > 2;
    })
    .sort((a, b) => {
      return b.total - a.total;
    })
    .slice(0, 2)
    .map((option) => option.key as keyof Options);

  const dcdResult: SoklDcdResult = {
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
      table: {
        optionsTotal: optionsTotal,
        categories: categoriesAll,
        options: optionsAll
      },
      charts: {
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
        ]
      },
      factors: {
        strengths: strengths,
        risks: risks,
        threats: threats
      },
      pupilsOptions: optionsCountsPupils,
      pupilsCategories: categoriesCountsPupils
    }
  };

  return dcdResult;
};