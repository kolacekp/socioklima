import { prisma } from '@/lib/prisma';
import QuestionnaireList from './components/questionnaireList';
import { QuestionnaireListDto } from '@/models/questionnaires/questionnaireListDto';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ContentNotAllowed from '../../components/contentNotAllowed';
import NoSchoolSelected from '../../components/noSchoolSelected';
import { isAllowedAccess } from '@/services/session.service';
import { RolesEnum } from '@/models/roles/roles.enum';
import { PupilQuestionnaireListDto } from '@/models/questionnaires/pupilQuestionnaireListDto';
import PupilQuestionnaireList from './components/pupilQuestionnaireList';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'dashboard.questionnaires.list' });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

const getQuestionnaires = async (schoolId: string, teacherId?: string) => {
  const questionnaires = await prisma.questionnaire.findMany({
    where: {
      schoolId: schoolId,
      deletedAt: null,
      class: {
        deletedAt: null,
        ...(teacherId
          ? {
              teacherId: teacherId
            }
          : {})
      }
    },
    select: {
      id: true,
      createdAt: true,
      closedAt: true,
      isArchived: true,
      class: {
        select: {
          name: true
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
          consent: true,
          deletedAt: null,
          pupil: {
            deletedAt: null
          }
        },
        select: {
          pupil: {
            select: {
              id: true
            }
          }
        }
      },
      questionnaireResults: {
        where: {
          deletedAt: null
        },
        select: {
          isCompleted: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  if (!questionnaires) return [];

  const questionnaireList: QuestionnaireListDto[] = questionnaires.map((questionnaire) => {
    return {
      id: questionnaire.id,
      createdAt: questionnaire.createdAt,
      closedAt: questionnaire.closedAt,
      isArchived: questionnaire.isArchived,
      class: {
        name: questionnaire.class.name
      },
      questionnaireType: {
        name: questionnaire.questionnaireType.name,
        shortName: questionnaire.questionnaireType.shortName
      },
      isCompleted: false,
      pupilCount: questionnaire.PupilToQuestionnaire.length,
      completedCount: questionnaire.questionnaireResults.filter((result) => result.isCompleted).length
    };
  });

  return questionnaireList;
};

const getPupilQuestionnaires = async (isPupil: boolean, userId: string) => {
  if (!isPupil) return [];

  const pupil = await prisma.pupil.findFirst({
    where: {
      deletedAt: null,
      userId: userId
    },
    select: {
      id: true
    }
  });

  if (!pupil) return [];

  const pupilQuestionnaires = await prisma.questionnaire.findMany({
    where: {
      deletedAt: null,
      PupilToQuestionnaire: {
        some: {
          pupilId: pupil.id,
          consent: true,
          deletedAt: null
        }
      }
    },
    select: {
      id: true,
      createdAt: true,
      closedAt: true,
      questionnaireType: {
        select: {
          name: true,
          shortName: true
        }
      },
      questionnaireResults: {
        where: {
          pupilId: pupil.id
        },
        select: {
          isCompleted: true
        },
        take: 1
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const pupilQuestionnaireList = pupilQuestionnaires as PupilQuestionnaireListDto[];

  return pupilQuestionnaireList;
};

export default async function QuestionnaireListPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return <ContentNotAllowed />;
  }

  if (!session.user.activeSchool?.id) {
    return <NoSchoolSelected />;
  }

  const teacherId = await prisma.teacher.findFirst({
    where: {
      userId: session.user.id
    },
    select: {
      id: true
    }
  });

  const isPupil = await isAllowedAccess([RolesEnum.PUPIL], session);
  let questionnaireList: QuestionnaireListDto[] = [];
  let pupilQuestionnaireList: PupilQuestionnaireListDto[] = [];

  if (isPupil) {
    pupilQuestionnaireList = await getPupilQuestionnaires(isPupil, session.user.id);
  } else {
    questionnaireList = await getQuestionnaires(session.user.activeSchool.id, teacherId?.id);
  }

  return (
    <>
      {!isPupil && (
        <div className={isPupil ? 'mb-12' : ''}>
          <QuestionnaireList questionnaireList={questionnaireList} />
        </div>
      )}
      {isPupil && <PupilQuestionnaireList questionnaireList={pupilQuestionnaireList} />}
    </>
  );
}
