import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { isUserAdmin } from 'services/session.service';
import { Role } from '@prisma/client';
import { RolesEnum } from '@/models/roles/roles.enum';

export interface TeacherDeleteRequest {
  teacherId: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as TeacherDeleteRequest;
  if (!body || !body.teacherId)
    return NextResponse.json(
      {
        error: 'Missing parameters'
      },
      { status: 400 }
    );

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) return NextResponse.json({}, { status: 401 });

  const isAdmin = await isUserAdmin(session);

  const teacher = await prisma.teacher.findFirst({
    where: {
      id: body.teacherId
    },
    include: {
      user: {
        include: {
          roles: true
        }
      }
    }
  });

  if (!teacher) return NextResponse.json({}, { status: 404 });

  const school = await prisma.school.findFirst({
    where: {
      id: teacher.schoolId
    }
  });

  if (!isAdmin && session.user.id !== school!.contactUserId) {
    return NextResponse.json({}, { status: 401 });
  }

  await prisma.teacher.update({
    where: {
      id: body.teacherId
    },
    data: {
      deletedAt: new Date()
    }
  });

  // unassign teacher from the class
  await prisma.class.updateMany({
    where: {
      teacherId: body.teacherId
    },
    data: {
      teacherId: null
    }
  });

  // delete the user record only if the teacher is the only role
  if (teacher.user.roles.length == 1 && teacher.user.roles.filter((r: Role) => r.slug == RolesEnum.TEACHER).length)
    await prisma.user.update({
      where: {
        id: teacher.userId
      },
      data: {
        email: 'ucet@byl.smazan',
        deletedAt: new Date()
      }
    });

  return NextResponse.json({}, { status: 200 });
}
