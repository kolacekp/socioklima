import { prisma } from '@/lib/prisma';
import moment from 'moment';
import { NextRequest, NextResponse } from 'next/server';
import { generatePassword, passwordHash } from '@/utils/passwords';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request?.json()) as {
    userId: string;
  };

  if (!body.userId) return NextResponse.json({}, { status: 400 });

  return await handleGeneratePassword(body.userId);
}

async function handleGeneratePassword(userId: string): Promise<NextResponse> {
  const password = generatePassword();
  const pwdHash = await passwordHash(password);

  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      password: pwdHash,
      updatedAt: moment().toDate()
    }
  });

  return NextResponse.json(
    {
      password: password
    },
    { status: 200 }
  );
}
