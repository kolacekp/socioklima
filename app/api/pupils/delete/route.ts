import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { isUserAdmin } from 'services/session.service';
import { Expert } from '@prisma/client';

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

  const userId = session.user.id;
  const isAdmin = await isUserAdmin(session);

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
        id: pupil.class.teacherId
      },
      select: {
        userId: true
      }
    });
  }

  const school = await prisma.school.findFirst({
    where: {
      id: pupil.class.schoolId
    },
    include: {
      experts: true
    }
  });

  if (
    !isAdmin &&
    !(teacher && userId !== teacher.userId) &&
    userId !== school!.contactUserId &&
    school!.experts.filter((e: Expert) => e.userId == userId).length == 0
  ) {
    return NextResponse.json({}, { status: 401 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      await Promise.all([
        tx.pupil.update({
          where: {
            id: body.id
          },
          data: {
            deletedAt: new Date(),
            user: {
              update: {
                data: {
                  name: null,
                  deletedAt: new Date()
                }
              }
            }
          },
          include: {
            user: true
          }
        }),
        tx.pupilToQuestionnaire.updateMany({
          where: {
            pupilId: body.id,
            questionnaire: {
              closedAt: null
            }
          },
          data: {
            deletedAt: new Date()
          }
        }),
        tx.questionnaireResult.updateMany({
          where: {
            pupilId: body.id,
            questionnaire: {
              closedAt: null
            }
          },
          data: {
            deletedAt: new Date()
          }
        })
      ]);
    });
  } catch (err) {
    return NextResponse.json({ error: 'Database transaction failure' }, { status: 400 });
  }

  return NextResponse.json({}, { status: 200 });
}
