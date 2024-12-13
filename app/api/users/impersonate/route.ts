import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export interface UserImpersonateRequest {
  id?: string;
  email?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const userId = request.nextUrl.searchParams.get('userId');

  const userToImpersonate = await prisma.user.findFirst({
    where: {
      id: userId || ''
    },
    select: {
      id: true,
      email: true,
      username: true
    }
  });

  return NextResponse.json(userToImpersonate, { status: 200 });
}
