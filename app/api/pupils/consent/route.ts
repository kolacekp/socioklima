import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export interface PupilEditConsentInterface {
  classId?: string;
  pupilIds?: Array<string>;
  consent: boolean;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as PupilEditConsentInterface;
  if (!body || (!body.classId && !body.pupilIds))
    return NextResponse.json(
      {
        error: 'Missing parameters'
      },
      { status: 400 }
    );

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) return NextResponse.json({}, { status: 401 });

  const cls = await prisma.class.findFirst({
    where: {
      id: body.classId
    }
  });
  if (!cls) return NextResponse.json({}, { status: 404 });

  if (body.classId) {
    await prisma.pupil.updateMany({
      where: {
        classId: body.classId
      },
      data: {
        consent: body.consent,
        updatedAt: new Date()
      }
    });
  } else {
    await prisma.pupil.updateMany({
      where: {
        id: { in: body.pupilIds }
      },
      data: {
        consent: body.consent,
        updatedAt: new Date()
      }
    });
  }

  return NextResponse.json({}, { status: 200 });
}
