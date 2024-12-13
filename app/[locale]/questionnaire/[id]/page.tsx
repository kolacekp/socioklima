import { prisma } from '@/lib/prisma';
import { QuestionnaireType } from 'models/questionnaires/questionnaire.model';
import Questionnaire from './components/questionnaire';
import Header from 'app/[locale]/dashboard/components/header';
import { Suspense } from 'react';
import QuestionnaireNavbar from './components/questionnaireNavbar';
import { RolesEnum } from '@/models/roles/roles.enum';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { isAllowedAccess } from '@/services/session.service';
import { getServerSession } from 'next-auth';
import { QuestionnaireContextProvider } from '../components/questionnaireContextProvider';
import { Answer, AnswerQuestion } from '@/models/questionnaires/answer.model';
import ContentNotAllowed from '../../dashboard/components/contentNotAllowed';
import { getTranslations } from 'next-intl/server';
import DataLoading from '../../dashboard/components/dataLoading';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'questionnaires.general' });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

const initializeAnswers = (questionnaire: QuestionnaireType) => {
  const answers: AnswerQuestion[] = [];

  questionnaire.questionnaireParts.forEach((part) => {
    part.questions.forEach((question) => {
      answers.push({
        questionId: question.id,
        partId: part.id,
        name: question.name,
        isCompleted: false,
        answers: [] as Answer[]
      });
    });
  });

  return answers;
};

const getPartsIds = (questionnaire: QuestionnaireType) => {
  const parts = questionnaire.questionnaireParts.map((part) => part.id);
  return parts;
};

export default async function SoklPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const showSchoolSelector = await isAllowedAccess([RolesEnum.ADMINISTRATOR, RolesEnum.SCHOOL_MANAGER]);

  const currentPupil = await prisma.pupil.findFirst({
    where: {
      userId: session?.user.id
    }
  });

  if (!currentPupil) return <ContentNotAllowed />;

  const q = await prisma.questionnaire.findFirst({
    where: {
      id: params.id,
      deletedAt: null,
      closedAt: null,
      PupilToQuestionnaire: {
        some: {
          pupilId: currentPupil.id,
          deletedAt: null
        }
      }
    }
  });
  if (!q) return <ContentNotAllowed />;

  const qType = await prisma.questionnaireType.findFirst({
    where: {
      id: q.questionnaireTypeId,
      isActive: true
    },
    include: {
      questionnaireParts: {
        include: {
          questions: {
            include: {
              answerOptions: true
            },
            orderBy: {
              order: 'asc'
            }
          }
        },
        orderBy: {
          order: 'asc'
        }
      }
    }
  });

  if (!qType) return <ContentNotAllowed />;

  const questionnaire = new QuestionnaireType(qType);

  const pupils = await prisma.pupilToQuestionnaire.findMany({
    where: {
      deletedAt: null,
      questionnaireId: params.id,
      NOT: {
        pupil: {
          userId: session?.user.id
        }
      }
    },
    select: {
      pupil: {
        select: {
          id: true,
          user: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });

  const pupilsFlat = pupils.flatMap((p) => {
    return p.pupil;
  });

  const answers = initializeAnswers(questionnaire);
  const partList = getPartsIds(questionnaire);

  const result = await prisma.questionnaireResult.findFirst({
    where: {
      questionnaireId: params.id,
      pupilId: currentPupil.id
    }
  });

  if (result?.isCompleted) return <ContentNotAllowed />;

  const getInitPartId = (lastCompletedPartId: string | null | undefined) => {
    if (!lastCompletedPartId) return partList[0];

    const index = partList.indexOf(lastCompletedPartId);
    if (index >= 0 && index < partList.length - 1) {
      return partList[index + 1];
    }

    return partList[0];
  };

  const initPartId = getInitPartId(result?.lastCompletedPartId);

  return (
    <>
      <QuestionnaireContextProvider
        questionnaire={questionnaire}
        questionnaireId={params.id}
        partList={partList}
        initPartId={initPartId}
      >
        <Suspense fallback={<DataLoading />}>
          <header className="sticky top-0 z-50">
            <div className="border-b">
              <Header user={session?.user} showSchoolSelector={showSchoolSelector} />
            </div>
            <div className="border-b bg-white">
              <QuestionnaireNavbar />
            </div>
          </header>
        </Suspense>
        <div className="flex dark:bg-gray-900">
          <main className="order-2 mx-4 mb-12 mt-4 flex-[1_0_16rem] overflow-auto">
            <Questionnaire questionnaire={questionnaire} pupils={pupilsFlat} answersInit={answers} />
          </main>
        </div>
      </QuestionnaireContextProvider>
    </>
  );
}
