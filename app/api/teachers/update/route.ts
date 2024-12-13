import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { ErrorsEnum } from '@/utils/errors.enum';
export interface TeacherUpdateRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  userId: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as TeacherUpdateRequest;
  if (!body) return NextResponse.json({}, { status: 400 });

  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({}, { status: 401 });

  if (body.email) {
    // we need to check if the email already exists
    const userWithEmail = await prisma.user.findFirst({
      where: {
        email: body.email,
        id: { not: body.userId }
      }
    });
    if (userWithEmail) return NextResponse.json({ code: ErrorsEnum.E_EMAIL_ALREADY_EXISTS }, { status: 400 });
  }

  const teacher = await prisma.teacher.update({
    where: {
      id: body.id
    },
    data: {
      user: {
        update: {
          where: {
            id: body.userId
          },
          data: {
            name: body.name,
            email: body.email,
            phone: body.phone?.replace(/\s/g, '')
          }
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
