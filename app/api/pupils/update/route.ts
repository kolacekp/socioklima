import { prisma } from '@/lib/prisma';
import { RolesEnum } from '@/models/roles/roles.enum';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PupilEditFormValues } from 'app/[locale]/dashboard/classes/pupils/(list)/[classId]/components/pupilEditModal';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { isAllowedAccess, isUserAdmin } from 'services/session.service';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as PupilEditFormValues;
  if (!body || !body.id)
    return NextResponse.json(
      {
        error: 'Missing parameters'
      },
      { status: 400 }
    );

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) return NextResponse.json({}, { status: 401 });

  const userId = session.user.id;
  const isAdmin = await isUserAdmin(session);
  const isExpert = await isAllowedAccess([RolesEnum.EXPERT], session);

  const pupil = await prisma.pupil.findFirst({
    where: {
      id: body.id
    },
    include: {
      class: true
    }
  });

  if (!pupil) return NextResponse.json({}, { status: 404 });

  let teacher;
  if (pupil.class.teacherId) {
    teacher = await prisma.teacher.findFirst({
      where: {
        id: pupil.class.teacherId!
      },
      select: {
        userId: true
      }
    });
  }

  const school = await prisma.school.findFirst({
    where: {
      id: pupil.class.schoolId
    }
  });

  if (!isAdmin && !isExpert && userId !== teacher?.userId && userId !== school?.contactUserId) {
    return NextResponse.json({}, { status: 401 });
  }

  const updatedPupil = await prisma.pupil.update({
    where: {
      id: body.id
    },
    data: {
      updatedAt: new Date(),
      number: body.number,
      gender: body.gender,
      nationality: body.nationality || null,
      user: {
        update: {
          data: {
            updatedAt: new Date(),
            name: body.name
          }
        }
      }
    },
    include: {
      user: true
    }
  });

  return NextResponse.json({ pupil: updatedPupil }, { status: 200 });
}
