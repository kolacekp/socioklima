import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { isAllowedAccess } from '@/services/session.service';
import { Role } from '@prisma/client';
import { RolesEnum } from '@/models/roles/roles.enum';
import { Prisma } from '.prisma/client';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({}, { status: 401 });

  const permCheck = await isAllowedAccess([RolesEnum.ADMINISTRATOR, RolesEnum.SCHOOL_MANAGER, RolesEnum.PRINCIPAL]);
  if (!permCheck) return NextResponse.json({}, { status: 401 });

  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email,
      deletedAt: null
    },
    include: {
      roles: true
    }
  });

  if (!user) return NextResponse.json({}, { status: 401 });

  const roles = user.roles.map((role: Role) => {
    return role.slug;
  });

  const search = request.nextUrl.searchParams.get('search');
  const skip = request.nextUrl.searchParams.get('skip');
  const take = request.nextUrl.searchParams.get('take');

  const wherePart: Prisma.SchoolWhereInput = {
    ...(roles.includes(RolesEnum.SCHOOL_MANAGER) && { contactUserId: user.id }),
    ...(search &&
      search != '' && {
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
    deletedAt: null
  };

  const data = await prisma.school.findMany({
    where: wherePart,
    ...(skip && { skip: parseInt(skip) }),
    ...(take && { take: parseInt(take) }),
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
  });

  const total = await prisma.school.count({ where: wherePart });

  return NextResponse.json(
    {
      data: data,
      total: total
    },
    { status: 200 }
  );
}
