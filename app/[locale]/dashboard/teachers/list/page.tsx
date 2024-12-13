import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ContentNotAllowed from '../../components/contentNotAllowed';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';
import { isAllowedAccess, isUserOnlyUnverifiedExpert } from 'services/session.service';
import { RolesEnum } from '@/models/roles/roles.enum';
import NoSchoolSelected from '../../components/noSchoolSelected';
import TeachersList from './components/teachersList';
import { getTranslations } from 'next-intl/server';
import DataLoading from '../../components/dataLoading';
import UnverifiedExpert from '../../components/unverifiedExpert';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'dashboard.teachers.list' });

  return {
    title: `SOCIOKLIMA | ${t('teachers')}`
  };
}

export default async function TeachersListPage() {
  const allowedRoles = [RolesEnum.ADMINISTRATOR, RolesEnum.SCHOOL_MANAGER, RolesEnum.EXPERT, RolesEnum.PRINCIPAL];
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(await isAllowedAccess(allowedRoles))) return <ContentNotAllowed />;

  const isUserOnlyUnverifiedExpertCheck = await isUserOnlyUnverifiedExpert(session);
  if (isUserOnlyUnverifiedExpertCheck) return <UnverifiedExpert />;

  if (!session.user.activeSchool?.id) return <NoSchoolSelected />;
  const schoolId = session.user.activeSchool?.id;

  const teachers = await prisma.teacher.findMany({
    where: {
      schoolId: schoolId,
      deletedAt: null,
      user: {
        deletedAt: null
      }
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          phone: true
        }
      },
      classes: true
    }
  });

  const classes = await prisma.class.findMany({
    where: {
      teacherId: null,
      schoolId: schoolId,
      deletedAt: null
    }
  });

  return (
    <Suspense fallback={<DataLoading />}>
      <TeachersList schoolId={schoolId} teachers={teachers} classes={classes} />
    </Suspense>
  );
}
