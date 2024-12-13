import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.activeSchool?.id)
    return NextResponse.json(
      {
        error: 'User not logged in'
      },
      { status: 401 }
    );

  const licenses = await prisma.license.findMany({
    where: {
      schoolId: session.user.activeSchool.id,
      isPaid: true,
      validUntil: {
        gte: new Date()
      },
      classesRemaining: {
        gt: 0
      },
      deletedAt: null
    }
  });

  return NextResponse.json(
    {
      licenses: licenses
    },
    { status: 200 }
  );
}
