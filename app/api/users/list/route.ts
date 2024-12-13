import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { isAllowedAccess } from '@/services/session.service';
import { RolesEnum } from '@/models/roles/roles.enum';
import { Prisma } from '.prisma/client';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({}, { status: 401 });

  const permCheck = await isAllowedAccess([RolesEnum.ADMINISTRATOR]);
  if (!permCheck) return NextResponse.json({}, { status: 401 });

  const search = request.nextUrl.searchParams.get('search');
  const role = request.nextUrl.searchParams.get('role');
  const skip = request.nextUrl.searchParams.get('skip');
  const take = request.nextUrl.searchParams.get('take');

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
    ...(skip && { skip: parseInt(skip) }),
    ...(take && { take: parseInt(take) }),
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      roles: true
    }
  });
  const total = await prisma.user.count({ where: wherePart });
  return NextResponse.json(
    {
      data: data,
      total: total
    },
    { status: 200 }
  );
}
