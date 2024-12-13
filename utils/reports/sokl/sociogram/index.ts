import { prisma } from '@/lib/prisma';
import { getResults } from '../../results';
import { Pupil, PupilId, SociogramResult, Layer, Relations } from './index.model';
import { diagramLayerToPngAsBase64 } from './relationsToDiagram';
import { Result } from '@/utils/reports/results.model';

const processResults = (results: Result[], genderRequired: boolean) => {
  const pupils: { [key: PupilId]: Pupil } = {};
  const relations: { [key in Layer]: Relations } = {
    positive: {},
    negative: {},
    aspirational: {}
  };

  results.forEach(({ questions, pupil }) => {
    pupils[pupil.id] = {
      name: pupil.user.name ?? pupil.id,
      gender: genderRequired && pupil.gender != null ? pupil.gender : 0
    };

    relations.positive[pupil.user.name ?? pupil.id] = [];
    relations.negative[pupil.user.name ?? pupil.id] = [];
    relations.aspirational[pupil.user.name ?? pupil.id] = [];

    questions.forEach(({ name, classmates }) => {
      if (name === 'sokl.questions.5') {
        relations.positive[pupil.user.name ?? pupil.id].push(...classmates);
      } else if (name === 'sokl.questions.6') {
        relations.negative[pupil.user.name ?? pupil.id].push(...classmates);
      } else if (name === 'sokl.questions.7') {
        relations.aspirational[pupil.user.name ?? pupil.id].push(...classmates);
      }
    });
  });

  Object.entries(relations.positive).forEach(([from, classmates]) => {
    relations.positive[from] = classmates.map((classmate) => pupils[classmate].name);
  });
  Object.entries(relations.negative).forEach(([from, classmates]) => {
    relations.negative[from] = classmates.map((classmate) => pupils[classmate].name);
  });
  Object.entries(relations.aspirational).forEach(([from, classmates]) => {
    relations.aspirational[from] = classmates.map((classmate) => pupils[classmate].name);
  });

  return { pupils, relations };
};

export const getSociogramResult = async (questionnaireId: string): Promise<SociogramResult | null> => {
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

  const schoolYear =
    (questionnaire.class.license.validUntil.getFullYear() - 1).toString() +
    ' / ' +
    questionnaire.class.license.validUntil.getFullYear().toString();

  const results = await getResults(questionnaireId);
  if (!results) return null;

  const { pupils, relations } = processResults(results, questionnaire.class.genderRequired);

  // const statistics = {
  //   friendly_relationship: {}, // vzájemná pozitivní volba mezi dvěma jedinci
  //   unfriendly_relationship: {}, // vzájemná negativní volba mezi dvěma jedinci:
  //   leader: [], // dostává především pozitivní volby (>70%)
  //   opposition_leader: [], // osoba s druhým nejvyšším počtem pozitivních voleb (záleží také na vztahu s vůdcem) >51%  a < 69%
  //   black_sheep: [], // dostává především negativní volby  >50%
  //   grey_mouse: [], // osoba rozdávající volby, která ale sama žádné volby nedostává
  //   hedgehog: [], // rozdává především negativní volby   >50%
  //   isolated: [], // osoba, která nedává ani nedostává žádné volby
  //   clique: [] // skupina účastníků, kteří mají mezi sebou oboustranný vztah sympatie:
  // };

  const result: SociogramResult = {
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
      diagrams: {
        positive: await diagramLayerToPngAsBase64(pupils, relations, 'positive'),
        negative: await diagramLayerToPngAsBase64(pupils, relations, 'negative'),
        aspirational: await diagramLayerToPngAsBase64(pupils, relations, 'aspirational')
      }
    }
  };

  return result;
};
