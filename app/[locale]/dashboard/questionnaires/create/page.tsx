import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ContentNotAllowed from '../../components/contentNotAllowed';
import { getServerSession } from 'next-auth';
import NoSchoolSelected from '../../components/noSchoolSelected';
import { prisma } from '@/lib/prisma';
import CreateQuestionnaireForm from './components/createQuestionnaireForm';
import { QuestionnaireTypeDto } from './models/questionnaireTypeDto';
import { ClassDto } from './models/classDto';
import { RolesEnum } from '@/models/roles/roles.enum';
import { isAllowedAccess } from '@/services/session.service';
import AlertMessage from '../../components/alertMessage';
import { getTranslations } from 'next-intl/server';
import { Role } from '@prisma/client';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'dashboard.questionnaires.create' });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

const isSchoolActivated = async (schoolId: string) => {
  const school = await prisma.school.findFirst({
    where: {
      deletedAt: null,
      id: schoolId
    },
    select: {
      activatedAt: true
    }
  });

  const isActivated = school?.activatedAt !== null;

  return isActivated;
};

const getClasses = async (schoolId: string) => {
  const classes = await prisma.class.findMany({
    where: {
      schoolId: schoolId,
      deletedAt: null,
      license: {
        deletedAt: null,
        isPaid: true,
        validUntil: {
          gte: new Date()
        }
      }
    },
    select: {
      id: true,
      name: true
    }
  });

  return (classes as ClassDto[]) || [];
};

const getQuestionnaireTypes = async () => {
  const questionnaireTypes = await prisma.questionnaireType.findMany({
    where: {
      isActive: true
    },
    select: {
      id: true,
      name: true,
      shortName: true
    }
  });

  return (questionnaireTypes as QuestionnaireTypeDto[]) || null;
};

export default async function CreateQuestionnairePage() {
  const allowedRoles = [RolesEnum.ADMINISTRATOR, RolesEnum.SCHOOL_MANAGER, RolesEnum.EXPERT, RolesEnum.PRINCIPAL];
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return <ContentNotAllowed />;
  }

  const isAllowed = await isAllowedAccess(allowedRoles, session);
  if (!isAllowed) return <ContentNotAllowed />;

  // we need to check if the expert is verified
  const roles = session?.user.roles ?? ([] as Role[]);
  const roleSlugs = roles.map((role: Role) => {
    return role.slug;
  });
  if (roleSlugs.length == 1 && roleSlugs.includes(RolesEnum.EXPERT)) {
    const expert = await prisma.expert.findFirst({
      where: { userId: session.user.id, deletedAt: null }
    });
    if (!expert || !expert.isVerified) return <ContentNotAllowed />;
  }

  if (!session.user.activeSchool?.id) return <NoSchoolSelected />;

  const isActivated = await isSchoolActivated(session.user.activeSchool.id);
  if (!isActivated) return <AlertMessage message="school_not_activated" />;

  const classes = await getClasses(session.user.activeSchool.id);
  const questionnaireTypes = await getQuestionnaireTypes();

  if (classes.length == 0) return <AlertMessage message="no_classes" />;

  if (questionnaireTypes.length == 0) return <AlertMessage message="no_questionnaires" />;

  return (
    <CreateQuestionnaireForm
      schoolId={session.user.activeSchool.id}
      classes={classes}
      questionnaireTypes={questionnaireTypes}
    />
  );
}
