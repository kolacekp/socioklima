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

  const permCheck = await isAllowedAccess([RolesEnum.ADMINISTRATOR, RolesEnum.SCHOOL_MANAGER, RolesEnum.PRINCIPAL]);
  if (!permCheck) return NextResponse.json({}, { status: 401 });

  const schoolId = request.nextUrl.searchParams.get('schoolId');
  const search = request.nextUrl.searchParams.get('search');
  const skip = request.nextUrl.searchParams.get('skip');
  const take = request.nextUrl.searchParams.get('take');

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
    ...(skip && { skip: parseInt(skip) }),
    ...(take && { take: parseInt(take) }),
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

  return NextResponse.json(
    {
      data: data,
      total: total
    },
    { status: 200 }
  );
}
