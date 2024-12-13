import { Suspense } from 'react';
import UsersList from './components/usersList';
import ContentNotAllowed from '../../components/contentNotAllowed';
import { isAllowedAccess } from 'services/session.service';
import { RolesEnum } from '@/models/roles/roles.enum';
import { parseIntParamValue, parseStringParamValue } from '@/utils/params';
import { prisma } from '@/lib/prisma';
import DataLoading from '../../components/dataLoading';
import { Prisma } from '.prisma/client';
import { SchoolFilterParams } from '../../schools/list/page';
import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'dashboard.users.users.list' });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

async function getUsers(skip: number, take: number, search?: string, role?: string) {
  const wherePart: Prisma.UserWhereInput = {
    ...(role && {
      roles: {
        some: {
          slug: role
        }
      }
    }),
    ...(!role && {
      roles: {
        some: {
          OR: [
            { slug: RolesEnum.ADMINISTRATOR },
            { slug: RolesEnum.SCHOOL_MANAGER },
            { slug: RolesEnum.PRINCIPAL },
            { slug: RolesEnum.EXPERT }
          ]
        }
      }
    }),
    ...(search &&
      search != '' && {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            email: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            username: {
              contains: search,
              mode: 'insensitive'
            }
          }
        ]
      }),
    deletedAt: null
  };

  const data = await prisma.user.findMany({
    where: wherePart,
    skip: skip,
    take: take,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      roles: true
    }
  });
  const total = await prisma.user.count({ where: wherePart });
  return { data, total };
}

export interface UserFilterParams {
  search?: string;
  role?: string;
}

export default async function UsersPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const allowedRoles = [RolesEnum.ADMINISTRATOR];
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(await isAllowedAccess(allowedRoles))) return <ContentNotAllowed />;

  const pageSize = 10;
  const page = parseIntParamValue(searchParams?.page) ?? 1;
  const search = parseStringParamValue(searchParams?.search);
  const role = parseStringParamValue(searchParams?.role);

  const filterParams = {
    search: search,
    role: role
  } as SchoolFilterParams;

  const users = await getUsers((page - 1) * pageSize, pageSize, search, role);

  return (
    <Suspense fallback={<DataLoading />}>
      <UsersList
        usersList={users.data}
        total={users.total}
        page={page}
        pageSize={pageSize}
        filterParams={filterParams}
        session={session}
      />
    </Suspense>
  );
}
