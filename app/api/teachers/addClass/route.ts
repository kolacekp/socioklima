import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Class } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { ErrorsEnum } from '@/utils/errors.enum';
import { TeacherClassesUpdateValues } from '../../../[locale]/dashboard/teachers/list/components/modals/teacherClassesModal';
export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as TeacherClassesUpdateValues;
  if (!body || !body.teacherId || !body.classId) return NextResponse.json({}, { status: 400 });

  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({}, { status: 401 });

  let teacher = await prisma.teacher.findFirst({
    where: {
      id: body.teacherId
    },
    include: {
      classes: true
    }
  });

  if (!teacher) return NextResponse.json({ code: ErrorsEnum.E_NON_EXISTING_TEACHER }, { status: 400 });

  const classes = teacher.classes as Class[];
  const existing = classes.filter((c: Class) => c.id == body.classId);
  if (existing.length) return NextResponse.json({ code: ErrorsEnum.E_CLASS_ALREADY_ASSIGNED }, { status: 400 });

  teacher = await prisma.teacher.update({
    where: {
      id: body.teacherId
    },
    data: {
      classes: {
        connect: {
          id: body.classId
        }
      }
    },
    include: {
      user: true,
      classes: true
    }
  });

  return NextResponse.json({ teacher: teacher }, { status: 200 });
}
