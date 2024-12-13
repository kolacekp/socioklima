import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ContentNotAllowed from '../../components/contentNotAllowed';
import { getServerSession } from 'next-auth';
import { isAllowedAccess, isUserAdmin } from 'services/session.service';
import { RolesEnum } from '@/models/roles/roles.enum';
import LicenseList from './components/licenseList';
import { getTranslations } from 'next-intl/server';
import NoSchoolSelected from '../../components/noSchoolSelected';
import { Suspense } from 'react';
import DataLoading from '../../components/dataLoading';
import { parseIntParamValue, parseStringParamValue } from '@/utils/params';
import { Prisma } from '.prisma/client';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'dashboard.licenses.list' });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

async function getLicenses(skip: number, take: number, search?: string, schoolId?: string) {
  const wherePart: Prisma.LicenseWhereInput = {
    ...(schoolId && {
      schoolId: schoolId
    }),
    deletedAt: null,
    school: {
      deletedAt: null
    },
    ...(search &&
      search && {
        OR: [
          {
            invoiceNumber: parseInt(search)
          },
          {
            school: {
              schoolName: {
                contains: search,
                mode: 'insensitive'
              },
              address: {
                contains: search,
                mode: 'insensitive'
              }
            }
          }
        ]
      })
  };

  const data = await prisma.license.findMany({
    where: wherePart,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      school: {
        select: { schoolName: true, country: true }
      }
    }
  });

  const total = await prisma.license.count({ where: wherePart });
  return { data, total };
}

export interface LicenseFilterParams {
  search?: string;
}

export default async function LicenseListPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    !session.user ||
    !(await isAllowedAccess([RolesEnum.ADMINISTRATOR, RolesEnum.SCHOOL_MANAGER, RolesEnum.PRINCIPAL]))
  ) {
    return <ContentNotAllowed />;
  }

  const schoolId = session.user.activeSchool?.id;
  const isAdmin = await isUserAdmin(session);

  if (!schoolId && !isAdmin) return <NoSchoolSelected />;

  const pageSize = 10;
  const page = parseIntParamValue(searchParams?.page) ?? 1;
  const search = parseStringParamValue(searchParams?.search);

  const filterParams = {
    search: search
  } as LicenseFilterParams;

  const licenses = await getLicenses((page - 1) * pageSize, pageSize, search, isAdmin ? undefined : schoolId);

  return (
    <Suspense fallback={<DataLoading />}>
      <LicenseList
        schoolId={schoolId}
        availableLicenses={licenses.data}
        total={licenses.total}
        page={page}
        pageSize={pageSize}
        filterParams={filterParams}
        isAdmin={isAdmin}
      />
    </Suspense>
  );
}
