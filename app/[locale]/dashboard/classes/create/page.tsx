import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ContentNotAllowed from '../../components/contentNotAllowed';
import { getServerSession } from 'next-auth';
import { isAllowedAccess, isUserOnlyUnverifiedExpert } from 'services/session.service';
import { RolesEnum } from '@/models/roles/roles.enum';
import NoLicense from '../../components/noLicense';
import NoSchoolSelected from '../../components/noSchoolSelected';
import CreateClassForm from './components/createClassForm';
import { getTranslations } from 'next-intl/server';
import UnverifiedExpert from '../../components/unverifiedExpert';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'dashboard.classes.create' });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

export default async function CreateClassPage() {
  const allowedRoles = [RolesEnum.ADMINISTRATOR, RolesEnum.SCHOOL_MANAGER, RolesEnum.EXPERT, RolesEnum.PRINCIPAL];
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(await isAllowedAccess(allowedRoles))) return <ContentNotAllowed />;

  const isUserOnlyUnverifiedExpertCheck = await isUserOnlyUnverifiedExpert(session);
  if (isUserOnlyUnverifiedExpertCheck) return <UnverifiedExpert />;

  if (!session.user.activeSchool?.id) return <NoSchoolSelected />;
  const schoolId = session.user.activeSchool?.id;

  const licenses = await prisma.license.findMany({
    where: {
      schoolId: schoolId,
      isPaid: true,
      validUntil: {
        gte: new Date()
      },
      classesRemaining: {
        gt: 0
      },
      deletedAt: null
    }
  });

  return licenses.length > 0 ? (
    <CreateClassForm licenses={licenses} schoolId={session.user.activeSchool.id} />
  ) : (
    <NoLicense />
  );
}
