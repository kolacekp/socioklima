import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { isUserAdmin } from 'services/session.service';

import { RolesEnum } from '@/models/roles/roles.enum';
import { Role } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export interface ExpertDeleteRequest {
  id: string;
  schoolId: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as ExpertDeleteRequest;
  if (!body || !body.id || !body.schoolId)
    return NextResponse.json(
      {
        error: 'Missing parameters'
      },
      { status: 400 }
    );

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) return NextResponse.json({}, { status: 401 });

  const isAdmin = await isUserAdmin(session);

  const expert = await prisma.expert.findFirst({
    where: {
      id: body.id
    },
    include: {
      user: {
        include: {
          roles: true
        }
      }
    }
  });

  if (!expert) return NextResponse.json({}, { status: 404 });

  const school = await prisma.school.findFirst({
    where: {
      id: body.schoolId
    }
  });

  if (!isAdmin && session.user.id !== school!.contactUserId) {
    return NextResponse.json({}, { status: 401 });
  }

  const updatedExpert = await prisma.expert.update({
    where: {
      id: body.id
    },
    data: {
      schools: {
        disconnect: {
          id: body.schoolId
        }
      }
    },
    include: {
      user: {
        include: {
          roles: true
        }
      },
      schools: true
    }
  });

  // delete the expert record only if it was it's last school
  if (updatedExpert.schools.length == 0) {
    await prisma.expert.update({
      where: {
        id: updatedExpert.id
      },
      data: {
        deletedAt: new Date()
      }
    });
  }

  // delete the user record only if the expert is the only role
  if (
    updatedExpert.user.roles.length == 1 &&
    updatedExpert.user.roles.filter((r: Role) => r.slug == RolesEnum.EXPERT).length
  )
    await prisma.user.update({
      where: {
        id: updatedExpert.userId
      },
      data: {
        email: 'ucet@byl.smazan',
        deletedAt: new Date()
      }
    });

  return NextResponse.json({}, { status: 200 });
}
