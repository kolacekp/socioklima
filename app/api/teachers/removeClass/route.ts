import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { TeacherClassesUpdateValues } from '../../../[locale]/dashboard/teachers/list/components/modals/teacherClassesModal';
export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as TeacherClassesUpdateValues;
  if (!body || !body.teacherId || !body.classId) return NextResponse.json({}, { status: 400 });

  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({}, { status: 401 });

  const teacher = await prisma.teacher.update({
    where: {
      id: body.teacherId
    },
    data: {
      classes: {
        disconnect: {
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
