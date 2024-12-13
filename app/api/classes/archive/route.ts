import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { isUserAdmin } from 'services/session.service';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  if (!body || !body.id)
    return NextResponse.json(
      {
        error: 'Missing parameters'
      },
      { status: 400 }
    );

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) return NextResponse.json({}, { status: 401 });

  const isAdmin = await isUserAdmin(session);

  const cls = await prisma.class.findFirst({
    where: {
      id: body.id
    },
    include: {
      school: true
    }
  });

  if (!cls) return NextResponse.json({}, { status: 404 });

  if (!isAdmin && session.user.id != cls.school.contactUserId) return NextResponse.json({}, { status: 401 });

  await prisma.class.update({
    where: {
      id: body.id
    },
    data: {
      questionnaires: {
        updateMany: {
          where: {
            isArchived: false,
            classId: body.id
          },
          data: {
            isArchived: true,
            closedAt: new Date()
          }
        }
      },
      isArchived: true
    }
  });

  return NextResponse.json({}, { status: 200 });
}
