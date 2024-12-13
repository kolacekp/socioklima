import { prisma } from '@/lib/prisma';
import QuestionnairePupilList from './components/questionnairePupilList';
import { PupilResultListDto } from './models/pupilResultListDto';
import { RolesEnum } from '@/models/roles/roles.enum';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { isAllowedAccess } from '@/services/session.service';
import ContentNotAllowed from '../../../components/contentNotAllowed';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'dashboard.questionnaires.pupils' });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

const getPupilResults = async (questionnaireId: string) => {
  const pupils = await prisma.pupil.findMany({
    where: {
      deletedAt: null,
      PupilToQuestionnaire: {
        some: {
          questionnaireId: questionnaireId,
          consent: true,
          deletedAt: null
        }
      }
    },
    select: {
      id: true,
      user: {
        select: {
          id: true,
          name: true
        }
      },
      questionnaireResults: {
        where: {
          questionnaireId: questionnaireId
        },
        select: {
          isCompleted: true
        }
      }
    }
  });

  const pupilResults = pupils as PupilResultListDto[];
  return pupilResults;
};

export default async function QuestionnaireResultsPage({ params }: { params: { id: string } }) {
  const allowedRoles = [
    RolesEnum.ADMINISTRATOR,
    RolesEnum.SCHOOL_MANAGER,
    RolesEnum.EXPERT,
    RolesEnum.TEACHER,
    RolesEnum.PRINCIPAL
  ];
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return <ContentNotAllowed />;
  }

  const isAllowed = await isAllowedAccess(allowedRoles, session);
  if (!isAllowed) {
    return <ContentNotAllowed />;
  }

  const pupilResults = await getPupilResults(params.id);

  const questionnaire = await prisma.questionnaire.findUnique({
    where: {
      id: params.id
    },
    include: {
      questionnaireType: {
        select: {
          name: true
        }
      }
    }
  });
  if (!questionnaire) return <ContentNotAllowed />;

  return (
    <>
      <QuestionnairePupilList
        pupilResults={pupilResults}
        questionnaireId={params.id}
        typeName={questionnaire.questionnaireType.name}
      />
    </>
  );
}
