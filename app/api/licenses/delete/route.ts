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

  if (!isAdmin) {
    return NextResponse.json({}, { status: 401 });
  }

  await prisma.license.update({
    where: {
      id: body.id
    },
    data: {
      deletedAt: new Date()
    }
  });

  return NextResponse.json({}, { status: 200 });
}
