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

  try {
    await prisma.$transaction(async (tx) => {
      await tx.class.update({
        where: {
          id: body.id
        },
        data: {
          pupils: {
            updateMany: {
              where: {
                deletedAt: null,
                classId: body.id
              },
              data: {
                deletedAt: new Date()
              }
            }
          },
          deletedAt: new Date()
        }
      });

      // update user records - set them as deleted
      const deletedPupils = await tx.pupil.findMany({
        where: {
          classId: body.id,
          NOT: [
            {
              deletedAt: null
            }
          ]
        },
        include: {
          user: {
            select: {
              id: true
            }
          }
        }
      });

      await tx.user.updateMany({
        where: {
          id: {
            in: deletedPupils.map((p) => p.user.id)
          },
          deletedAt: null
        },
        data: {
          deletedAt: new Date()
        }
      });
    });
  } catch (err) {
    return NextResponse.json({ error: 'Database transaction failure' }, { status: 400 });
  }

  return NextResponse.json({}, { status: 200 });
}
