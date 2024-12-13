import { prisma } from '@/lib/prisma';
import { Suspense } from 'react';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ContentNotAllowed from '../../components/contentNotAllowed';
import { getServerSession } from 'next-auth';
import { isAllowedAccess, isUserAdmin } from 'services/session.service';
import { RolesEnum } from '@/models/roles/roles.enum';
import NoSchoolSelected from '../../components/noSchoolSelected';
import ExpertsList from './components/expertsList';
import { getTranslations } from 'next-intl/server';
import DataLoading from '../../components/dataLoading';
import { parseIntParamValue, parseStringParamValue } from '@/utils/params';
import { ExpertDto } from '@/models/experts/expert.dto';
import { Prisma } from '.prisma/client';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'dashboard.experts.list' });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

async function getExperts(skip: number, take: number, search?: string, schoolId?: string) {
  const wherePart: Prisma.ExpertWhereInput = {
    ...(schoolId && {
      schools: {
        some: {
          id: schoolId
        }
      }
    }),
    ...(search &&
      search && {
        OR: [
          {
            user: {
              name: {
                contains: search,
                mode: 'insensitive'
              }
            }
          },
          {
            user: {
              email: {
                contains: search,
                mode: 'insensitive'
              }
            }
          },
          {
            user: {
              username: {
                contains: search,
                mode: 'insensitive'
              }
            }
          },
          {
            schools: {
              some: {
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
          }
        ]
      }),
    deletedAt: null,
    user: {
      deletedAt: null
    }
  };

  const data = (await prisma.expert.findMany({
    where: wherePart,
    skip: skip,
    take: take,
    orderBy: {
      createdAt: 'desc'
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
      schools: true
    }
  })) as ExpertDto[];

  const total = await prisma.expert.count({ where: wherePart });
  return { data, total };
}

export interface ExpertFilterParams {
  search?: string;
}

export default async function ExpertsPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    !session.user ||
    !(await isAllowedAccess([RolesEnum.ADMINISTRATOR, RolesEnum.SCHOOL_MANAGER, RolesEnum.PRINCIPAL]))
  )
    return <ContentNotAllowed />;

  const schoolId = session.user.activeSchool?.id;
  const isAdmin = await isUserAdmin(session);

  if (!schoolId && !isAdmin) return <NoSchoolSelected />;

  const pageSize = 10;
  const page = parseIntParamValue(searchParams?.page) ?? 1;
  const search = parseStringParamValue(searchParams?.search);

  const filterParams = {
    search: search
  } as ExpertFilterParams;

  const experts = await getExperts((page - 1) * pageSize, pageSize, search, isAdmin ? undefined : schoolId);

  return (
    <Suspense fallback={<DataLoading />}>
      <ExpertsList
        schoolId={schoolId}
        expertsList={experts.data}
        total={experts.total}
        page={page}
        pageSize={pageSize}
        filterParams={filterParams}
        isAdmin={isAdmin}
      />
    </Suspense>
  );
}
