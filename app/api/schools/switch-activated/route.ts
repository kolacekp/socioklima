import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { isUserAdmin } from '@/services/session.service';
import moment from 'moment';
import { sendSchoolActivatedEmailToManager } from '@/services/nodemailer.service';

export interface SchoolSwitchActivatedRequest {
  schoolId: string;
  locale: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as SchoolSwitchActivatedRequest;
  if (!body || !body.schoolId)
    return NextResponse.json(
      {
        error: 'Missing parameters'
      },
      { status: 400 }
    );

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) return NextResponse.json({}, { status: 401 });

  const isAdmin = await isUserAdmin(session);
  if (!isAdmin) return NextResponse.json({}, { status: 401 });

  let school = await prisma.school.findFirst({
    where: {
      id: body.schoolId
    },
    include: {
      principal: {
        include: {
          user: true
        }
      }
    }
  });
  if (!school) return NextResponse.json({}, { status: 404 });

  const activatedAt = school.activatedAt == null ? moment().toDate() : null;

  school = await prisma.school.update({
    where: {
      id: body.schoolId
    },
    data: {
      activatedAt: activatedAt
    },
    include: {
      principal: {
        include: {
          user: true
        }
      }
    }
  });

  if (activatedAt && school.principal && school.principal.user && school.principal.user.email) {
    await sendSchoolActivatedEmailToManager(
      school.principal.user.email,
      school.schoolName,
      school.businessId,
      body.locale
    );
  }

  return NextResponse.json(school, { status: 200 });
}
