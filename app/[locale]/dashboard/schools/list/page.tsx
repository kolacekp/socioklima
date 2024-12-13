import { SchoolWithPrincipal } from '@/models/schools/schoolWithPrincipal';
import SchoolList from './schoolList';
import { RolesEnum } from '@/models/roles/roles.enum';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { isAllowedAccess, isUserAdmin } from 'services/session.service';
import ContentNotAllowed from '../../components/contentNotAllowed';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { parseIntParamValue, parseStringParamValue } from '@/utils/params';
import DataLoading from '../../components/dataLoading';
import { Suspense } from 'react';
import { Prisma } from '.prisma/client';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'dashboard.school.list' });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

async function getSchools(skip: number, take: number, search?: string, country?: number, userId?: string) {
  const wherePart: Prisma.SchoolWhereInput = {
    ...(userId && { contactUserId: userId }),
    ...(search &&
      search && {
        OR: [
          {
            schoolName: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            address: {
              contains: search,
              mode: 'insensitive'
            }
          }
        ]
      }),
    ...(country !== undefined && {
      country: country
    }),
    deletedAt: null
  };

  const data = (await prisma.school.findMany({
    where: wherePart,
    skip: skip,
    take: take,
    orderBy: [
      {
        schoolName: 'asc'
      }
    ],
    include: {
      principal: {
        select: {
          user: true
        }
      }
    }
  })) as SchoolWithPrincipal[];

  const total = await prisma.school.count({ where: wherePart });
  return { data, total };
}

export interface SchoolFilterParams {
  search?: string;
  country?: number;
}

export default async function SchoolListPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const allowedRoles = [RolesEnum.ADMINISTRATOR, RolesEnum.SCHOOL_MANAGER, RolesEnum.PRINCIPAL];
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id || !(await isAllowedAccess(allowedRoles, session))) {
    return <ContentNotAllowed />;
  }

  const isAdmin = await isUserAdmin();

  const pageSize = 10;
  const page = parseIntParamValue(searchParams?.page) ?? 1;
  const search = parseStringParamValue(searchParams?.search);
  const country = parseIntParamValue(searchParams?.country);

  const filterParams = {
    search: search,
    country: country
  } as SchoolFilterParams;

  const schools = await getSchools(
    (page - 1) * pageSize,
    pageSize,
    search,
    country,
    isAdmin ? undefined : session.user.id
  );

  return (
    <Suspense fallback={<DataLoading />}>
      <SchoolList
        schools={schools.data}
        total={schools.total}
        page={page}
        pageSize={pageSize}
        filterParams={filterParams}
        isAdmin={isAdmin}
      />
    </Suspense>
  );
}
