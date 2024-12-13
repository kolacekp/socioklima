import { prisma } from '@/lib/prisma';
import { Count, GenderCount, IndexTiers, Options, PupilIndex, SoklSocialIndexResult } from './index.model';
import { getResults } from '../../results';
import { Result } from '../../results.model';
import { getSocialIndexV2, getSocialIndexV2Distance, getSocialIndexV2Tier } from '../../socialIndex';
import { isThreatOrThreatened } from '../../socialIndex/socialIndexV2';
import { getReportPupilName } from '../../getReportPupilName';

const createCountStructure = (): Count => {
  return {
    total: 0,
    gender: {
      0: 0,
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

// const isKeyOfIndexes = (value: number, indexes: IndexTiers): value is keyof IndexTiers => {
//   return Object.keys(indexes).includes(value.toString());
// };

export const getSoklSocialIndexResult = async (questionnaireId: string): Promise<SoklSocialIndexResult | null> => {
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

  const pupils = results.map((result) => result.pupil).sort((a, b) => (a.number ?? 0) - (b.number ?? 0));

  const pupilIndexes: PupilIndex[] = pupils.map((pupil) => {
    const pupilOptions = initOptions();
    countOptions(results, pupilOptions, undefined, 'sokl.questions.8', true, pupil.id);
    const index = getSocialIndexV2(pupilOptions);
    return {
      pupilId: pupil.id,
      name: getReportPupilName(pupil, questionnaire),
      gender: pupil.gender,
      number: pupil.number,
      index,
      distance: getSocialIndexV2Distance(index),
      tier: getSocialIndexV2Tier(index),
      threatOrThreatened: isThreatOrThreatened(pupilOptions)
    };
  });

  const tiers: IndexTiers = {
    1: createCountStructure(),
    2: createCountStructure(),
    3: createCountStructure(),
    4: createCountStructure(),
    5: createCountStructure(),
    6: createCountStructure()
  };

  pupilIndexes.forEach((pupilIndex) => {
    tiers[pupilIndex.tier as keyof IndexTiers].total += 1;
    tiers[pupilIndex.tier as keyof IndexTiers].gender[(pupilIndex.gender ?? 0) as keyof GenderCount] += 1;
  });

  const result: SoklSocialIndexResult = {
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
      index: {
        tiers: tiers,
        pupilIndexes: pupilIndexes
      }
    }
  };

  return result;
};