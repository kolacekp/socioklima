import { prisma } from '@/lib/prisma';
import { getResults } from '../../results';
import { Answer, Pupil, Question, Result } from '../../results.model';
import { Categories, Count, Factors, Options, UnvetPupilCardResult } from './card.model';
import { QuestionsToOptions } from '../questionsToOptions.type';
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
  targetPupilId?: string,
  comments?: string[]
) => {
  results.forEach((result) => {
    if (!pupilId || result.pupil.id === pupilId) {
      result.questions.forEach((question) => {
        if (!questionName || question.name === questionName) {
          if (!hasTargetPupil || (hasTargetPupil && question.pupil)) {
            if (!targetPupilId || question.pupil.id === targetPupilId) {
              if (question.comment) comments?.push(question.comment);
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

const isKeyOfQuestionsToOptions = (value: string, indexes: QuestionsToOptions): value is keyof QuestionsToOptions => {
  return Object.keys(indexes).includes(value);
};

const normalizeReults = (result: Result[], pupils: Pupil[]) => {
  const questionsToOptions: QuestionsToOptions = {
    'unvet.questions.5': 'A1',
    'unvet.questions.6': 'A2',
    'unvet.questions.7': 'A3',
    'unvet.questions.8': 'B1',
    'unvet.questions.9': 'B2',
    'unvet.questions.10': 'B3',
    'unvet.questions.11': 'C1',
    'unvet.questions.12': 'C2',
    'unvet.questions.13': 'C3',
    'unvet.questions.14': 'D1',
    'unvet.questions.15': 'D2',
    'unvet.questions.16': 'D3',
    'unvet.questions.17': 'E1',
    'unvet.questions.18': 'E2',
    'unvet.questions.19': 'E3',
    'unvet.questions.20': 'F1',
    'unvet.questions.21': 'F2',
    'unvet.questions.22': 'F3',
    'unvet.questions.23': 'G1',
    'unvet.questions.24': 'G2',
    'unvet.questions.25': 'G3',
    'unvet.questions.26': 'H1',
    'unvet.questions.27': 'H2',
    'unvet.questions.28': 'H3',
    'unvet.questions.29': 'I1',
    'unvet.questions.30': 'I2',
    'unvet.questions.31': 'I3'
  };
  return result.map((result) => {
    const questionArray: Question[] = [];

    result.questions.map((question) => {
      if (isKeyOfQuestionsToOptions(question.name, questionsToOptions)) {
        question.classmates.map((classmate) => {
          questionArray.push({
            ...question,
            name: 'part2',
            pupil: pupils.find((pupil) => pupil.id === classmate),
            answers: [
              {
                id: '',
                type: 0,
                value: questionsToOptions[question.name as keyof QuestionsToOptions],
                category: questionsToOptions[question.name as keyof QuestionsToOptions][0]
              } as Answer
            ]
          } as Question);
        });
      } else {
        questionArray.push(question);
      }
    });

    return {
      ...result,
      questions: questionArray.map((question) => question)
    } as Result;
  });
};

export const getUnvetPupilCardResult = async (
  questionnaireId: string,
  pupilId: string
): Promise<UnvetPupilCardResult | null> => {
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

  const pupil = await prisma.pupil.findUnique({
    where: {
      id: pupilId
    },
    include: {
      user: {
        select: {
          name: true
        }
      }
    }
  });
  if (!pupil) return null;

  const qPupils = await prisma.pupil.findMany({
    where: {
      PupilToQuestionnaire: {
        some: {
          questionnaireId: questionnaireId
        }
      }
    },
    include: {
      user: {
        select: {
          name: true
        }
      }
    }
  });

  const results_ = await getResults(questionnaireId);
  if (!results_) return null;

  const results = normalizeReults(results_, qPupils as Pupil[]);

  const schoolYear =
    (questionnaire.class.license.validUntil.getFullYear() - 1).toString() +
    ' / ' +
    questionnaire.class.license.validUntil.getFullYear().toString();

  const optionsFromOthers = initOptions();
  const comments: string[] = [];
  countOptions(results, optionsFromOthers, undefined, 'part2', true, pupilId, comments);
  const categoriesFO: Categories = {
    A: {
      total: optionsFromOthers.A1.total + optionsFromOthers.A2.total + optionsFromOthers.A3.total,
      gender: {
        1: optionsFromOthers.A1.gender[1] + optionsFromOthers.A2.gender[1] + optionsFromOthers.A3.gender[1],
        2: optionsFromOthers.A1.gender[2] + optionsFromOthers.A2.gender[2] + optionsFromOthers.A3.gender[2],
        3: optionsFromOthers.A1.gender[3] + optionsFromOthers.A2.gender[3] + optionsFromOthers.A3.gender[3]
      }
    },
    B: {
      total: optionsFromOthers.B1.total + optionsFromOthers.B2.total + optionsFromOthers.B3.total,
      gender: {
        1: optionsFromOthers.B1.gender[1] + optionsFromOthers.B2.gender[1] + optionsFromOthers.B3.gender[1],
        2: optionsFromOthers.B1.gender[2] + optionsFromOthers.B2.gender[2] + optionsFromOthers.B3.gender[2],
        3: optionsFromOthers.B1.gender[3] + optionsFromOthers.B2.gender[3] + optionsFromOthers.B3.gender[3]
      }
    },
    C: {
      total: optionsFromOthers.C1.total + optionsFromOthers.C2.total + optionsFromOthers.C3.total,
      gender: {
        1: optionsFromOthers.C1.gender[1] + optionsFromOthers.C2.gender[1] + optionsFromOthers.C3.gender[1],
        2: optionsFromOthers.C1.gender[2] + optionsFromOthers.C2.gender[2] + optionsFromOthers.C3.gender[2],
        3: optionsFromOthers.C1.gender[3] + optionsFromOthers.C2.gender[3] + optionsFromOthers.C3.gender[3]
      }
    },
    D: {
      total: optionsFromOthers.D1.total + optionsFromOthers.D2.total + optionsFromOthers.D3.total,
      gender: {
        1: optionsFromOthers.D1.gender[1] + optionsFromOthers.D2.gender[1] + optionsFromOthers.D3.gender[1],
        2: optionsFromOthers.D1.gender[2] + optionsFromOthers.D2.gender[2] + optionsFromOthers.D3.gender[2],
        3: optionsFromOthers.D1.gender[3] + optionsFromOthers.D2.gender[3] + optionsFromOthers.D3.gender[3]
      }
    },
    E: {
      total: optionsFromOthers.E1.total + optionsFromOthers.E2.total + optionsFromOthers.E3.total,
      gender: {
        1: optionsFromOthers.E1.gender[1] + optionsFromOthers.E2.gender[1] + optionsFromOthers.E3.gender[1],
        2: optionsFromOthers.E1.gender[2] + optionsFromOthers.E2.gender[2] + optionsFromOthers.E3.gender[2],
        3: optionsFromOthers.E1.gender[3] + optionsFromOthers.E2.gender[3] + optionsFromOthers.E3.gender[3]
      }
    },
    F: {
      total: optionsFromOthers.F1.total + optionsFromOthers.F2.total + optionsFromOthers.F3.total,
      gender: {
        1: optionsFromOthers.F1.gender[1] + optionsFromOthers.F2.gender[1] + optionsFromOthers.F3.gender[1],
        2: optionsFromOthers.F1.gender[2] + optionsFromOthers.F2.gender[2] + optionsFromOthers.F3.gender[2],
        3: optionsFromOthers.F1.gender[3] + optionsFromOthers.F2.gender[3] + optionsFromOthers.F3.gender[3]
      }
    },
    G: {
      total: optionsFromOthers.G1.total + optionsFromOthers.G2.total + optionsFromOthers.G3.total,
      gender: {
        1: optionsFromOthers.G1.gender[1] + optionsFromOthers.G2.gender[1] + optionsFromOthers.G3.gender[1],
        2: optionsFromOthers.G1.gender[2] + optionsFromOthers.G2.gender[2] + optionsFromOthers.G3.gender[2],
        3: optionsFromOthers.G1.gender[3] + optionsFromOthers.G2.gender[3] + optionsFromOthers.G3.gender[3]
      }
    },
    H: {
      total: optionsFromOthers.H1.total + optionsFromOthers.H2.total + optionsFromOthers.H3.total,
      gender: {
        1: optionsFromOthers.H1.gender[1] + optionsFromOthers.H2.gender[1] + optionsFromOthers.H3.gender[1],
        2: optionsFromOthers.H1.gender[2] + optionsFromOthers.H2.gender[2] + optionsFromOthers.H3.gender[2],
        3: optionsFromOthers.H1.gender[3] + optionsFromOthers.H2.gender[3] + optionsFromOthers.H3.gender[3]
      }
    },
    I: {
      total: optionsFromOthers.I1.total + optionsFromOthers.I2.total + optionsFromOthers.I3.total,
      gender: {
        1: optionsFromOthers.I1.gender[1] + optionsFromOthers.I2.gender[1] + optionsFromOthers.I3.gender[1],
        2: optionsFromOthers.I1.gender[2] + optionsFromOthers.I2.gender[2] + optionsFromOthers.I3.gender[2],
        3: optionsFromOthers.I1.gender[3] + optionsFromOthers.I2.gender[3] + optionsFromOthers.I3.gender[3]
      }
    }
  };

  const optionsFOCount =
    categoriesFO.A.total +
    categoriesFO.B.total +
    categoriesFO.C.total +
    categoriesFO.D.total +
    categoriesFO.E.total +
    categoriesFO.F.total +
    categoriesFO.G.total +
    categoriesFO.H.total +
    categoriesFO.I.total;

  const ownResult = results.find((result) => {
    return result.pupil.id === pupil.id;
  });
  if (!ownResult) return null;
  const q1 = ownResult.questions.filter((question) => {
    return question.name === 'unvet.questions.1';
  });
  const q2 = ownResult.questions.filter((question) => {
    return question.name === 'unvet.questions.2';
  });
  const q3 = ownResult.questions.filter((question) => {
    return question.name === 'unvet.questions.3';
  });
  const q4 = ownResult.questions.filter((question) => {
    return question.name === 'unvet.questions.4';
  });
  const optionsQ1 = q1.length > 0 ? q1[0].answers.map((answer) => answer.value) : [];
  const optionsQ2 = q2.length > 0 ? q2[0].answers.map((answer) => answer.value) : [];
  const optionsQ3 = q3.length > 0 ? q3[0].answers.map((answer) => answer.value) : [];
  const optionsQ4 = q4.length > 0 ? q4[0].answers.map((answer) => answer.value) : [];

  const getFactors = () => {
    const options = optionsFromOthers;
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
      strengths,
      risks,
      threats
    } as Factors;
  };
  const factors = getFactors();

  const result: UnvetPupilCardResult = {
    info: {
      pupil: {
        name: getReportPupilName(pupil, questionnaire),
        number: pupil.number
      },
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
      factors: factors,
      options: {
        fromOthers: optionsFromOthers,
        fromOthersTotal: optionsFOCount,
        1: optionsQ1,
        2: optionsQ2,
        3: optionsQ3,
        4: optionsQ4
      },
      categories: {
        fromOthers: categoriesFO
      },
      charts: {
        total: [
          Number(((categoriesFO.A.total / optionsFOCount) * 100).toFixed(0)),
          Number(((categoriesFO.B.total / optionsFOCount) * 100).toFixed(0)),
          Number(((categoriesFO.C.total / optionsFOCount) * 100).toFixed(0)),
          Number(((categoriesFO.D.total / optionsFOCount) * 100).toFixed(0)),
          Number(((categoriesFO.E.total / optionsFOCount) * 100).toFixed(0)),
          Number(((categoriesFO.F.total / optionsFOCount) * 100).toFixed(0)),
          Number(((categoriesFO.G.total / optionsFOCount) * 100).toFixed(0)),
          Number(((categoriesFO.H.total / optionsFOCount) * 100).toFixed(0)),
          Number(((categoriesFO.I.total / optionsFOCount) * 100).toFixed(0))
        ],
        gender: {
          1: [
            Number(((categoriesFO.A.gender[1] / optionsFOCount) * 100).toFixed(0)),
            Number(((categoriesFO.B.gender[1] / optionsFOCount) * 100).toFixed(0)),
            Number(((categoriesFO.C.gender[1] / optionsFOCount) * 100).toFixed(0)),
            Number(((categoriesFO.D.gender[1] / optionsFOCount) * 100).toFixed(0)),
            Number(((categoriesFO.E.gender[1] / optionsFOCount) * 100).toFixed(0)),
            Number(((categoriesFO.F.gender[1] / optionsFOCount) * 100).toFixed(0)),
            Number(((categoriesFO.G.gender[1] / optionsFOCount) * 100).toFixed(0)),
            Number(((categoriesFO.H.gender[1] / optionsFOCount) * 100).toFixed(0)),
            Number(((categoriesFO.I.gender[1] / optionsFOCount) * 100).toFixed(0))
          ],
          2: [
            Number(((categoriesFO.A.gender[2] / optionsFOCount) * 100).toFixed(0)),
            Number(((categoriesFO.B.gender[2] / optionsFOCount) * 100).toFixed(0)),
            Number(((categoriesFO.C.gender[2] / optionsFOCount) * 100).toFixed(0)),
            Number(((categoriesFO.D.gender[2] / optionsFOCount) * 100).toFixed(0)),
            Number(((categoriesFO.E.gender[2] / optionsFOCount) * 100).toFixed(0)),
            Number(((categoriesFO.F.gender[2] / optionsFOCount) * 100).toFixed(0)),
            Number(((categoriesFO.G.gender[2] / optionsFOCount) * 100).toFixed(0)),
            Number(((categoriesFO.H.gender[2] / optionsFOCount) * 100).toFixed(0)),
            Number(((categoriesFO.I.gender[2] / optionsFOCount) * 100).toFixed(0))
          ],
          3: [
            Number(((categoriesFO.A.gender[3] / optionsFOCount) * 100).toFixed(0)),
            Number(((categoriesFO.B.gender[3] / optionsFOCount) * 100).toFixed(0)),
            Number(((categoriesFO.C.gender[3] / optionsFOCount) * 100).toFixed(0)),
            Number(((categoriesFO.D.gender[3] / optionsFOCount) * 100).toFixed(0)),
            Number(((categoriesFO.E.gender[3] / optionsFOCount) * 100).toFixed(0)),
            Number(((categoriesFO.F.gender[3] / optionsFOCount) * 100).toFixed(0)),
            Number(((categoriesFO.G.gender[3] / optionsFOCount) * 100).toFixed(0)),
            Number(((categoriesFO.H.gender[3] / optionsFOCount) * 100).toFixed(0)),
            Number(((categoriesFO.I.gender[3] / optionsFOCount) * 100).toFixed(0))
          ]
        }
      },
      comments: comments
    }
  };

  return result;
};
