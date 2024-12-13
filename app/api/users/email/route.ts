import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest) {
  const user = await prisma.user.findFirst({
    where: {
      email: request.nextUrl.searchParams.get('email')
    }
  });

  return NextResponse.json(!!user);
}
