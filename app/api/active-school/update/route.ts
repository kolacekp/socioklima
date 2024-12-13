import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  if (!body || !body.userId || body.schoolId === undefined)
    return NextResponse.json(
      {
        error: 'Missing parameters'
      },
      { status: 400 }
    );

  await prisma.user.update({
    where: {
      id: body.userId
    },
    data: {
      activeSchoolId: body.schoolId
    }
  });

  return NextResponse.json({}, { status: 200 });
}
