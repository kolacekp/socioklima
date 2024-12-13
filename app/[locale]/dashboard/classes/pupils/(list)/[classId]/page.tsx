import { prisma } from '@/lib/prisma';
import PupilList from './components/pupilList';
import { RolesEnum } from '@/models/roles/roles.enum';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ContentNotAllowed from '../../../../components/contentNotAllowed';
import { isAllowedAccess, isUserOnlyUnverifiedExpert } from 'services/session.service';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import DataLoading from '../../../../components/dataLoading';
import UnverifiedExpert from '../../../../components/unverifiedExpert';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'dashboard.pupils.list' });

  return {
    title: `SOCIOKLIMA | ${t('title')}`
  };
}

export default async function PupilListPage({ params }: { params: { classId: string } }) {
  const allowedRoles = [
    RolesEnum.ADMINISTRATOR,
    RolesEnum.SCHOOL_MANAGER,
    RolesEnum.PRINCIPAL,
    RolesEnum.EXPERT,
    RolesEnum.TEACHER
  ];
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id || !(await isAllowedAccess(allowedRoles, session)))
    return <ContentNotAllowed />;

  const isUserOnlyUnverifiedExpertCheck = await isUserOnlyUnverifiedExpert(session);
  if (isUserOnlyUnverifiedExpertCheck) return <UnverifiedExpert />;

  const cls = await prisma.class.findFirst({
    where: {
      id: params.classId,
      deletedAt: null
    },
    include: {
      license: {
        select: {
          deletedAt: true,
          isPaid: true,
          validUntil: true
        }
      },
      pupils: {
        where: {
          deletedAt: null,
          user: {
            deletedAt: null
          }
        },
        orderBy: {
          number: 'asc'
        },
        include: {
          user: true
        }
      }
    }
  });

  if (!cls) return <ContentNotAllowed />;

  const isLicenseValid = cls.license.validUntil > new Date() && !cls.license.deletedAt && cls.license.isPaid;

  return (
    <Suspense fallback={<DataLoading />}>
      <PupilList pupilList={cls.pupils} classId={cls.id} className={cls.name} isLicenseValid={isLicenseValid} />
    </Suspense>
  );
}
