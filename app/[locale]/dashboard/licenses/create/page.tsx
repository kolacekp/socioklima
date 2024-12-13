import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ContentNotAllowed from '../../components/contentNotAllowed';
import { getServerSession } from 'next-auth';
import { isAllowedAccess, isUserAdmin } from 'services/session.service';
import { RolesEnum } from '@/models/roles/roles.enum';
import NoSchoolSelected from '../../components/noSchoolSelected';
import CreateLicenseForm from './components/createLicenseForm';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'dashboard.licenses.create' });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

export default async function CreateLicensePage() {
  const allowedRoles = [RolesEnum.ADMINISTRATOR, RolesEnum.SCHOOL_MANAGER, RolesEnum.PRINCIPAL];
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(await isAllowedAccess(allowedRoles))) return <ContentNotAllowed />;

  if (!session.user.activeSchool?.id) return <NoSchoolSelected />;
  const schoolId = session.user.activeSchool?.id;

  const school = await prisma.school.findFirst({
    where: {
      id: schoolId
    },
    select: {
      country: true
    }
  });
  if (!school) return <NoSchoolSelected />;

  const isAdmin = await isUserAdmin();

  return <CreateLicenseForm schoolId={schoolId} isAdmin={isAdmin} country={school.country} />;
}
