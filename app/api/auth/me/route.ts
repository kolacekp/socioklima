import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  if (session && session.user) {
    const user = await prisma.user.findFirst({
      where: {
        id: session.user.id,
        deletedAt: null
      },
      select: {
        id: true
      }
    });

    if (!user) return NextResponse.json({}, { status: 401 });
  }

  return NextResponse.json({ status: 200 });
}
