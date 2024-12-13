import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { comparePassword, passwordHash } from '@/utils/passwords';
import { ErrorsEnum } from '@/utils/errors.enum';

export interface ChangeUserPasswordRequest {
  userId: string;
  old: string;
  new: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request?.json()) as ChangeUserPasswordRequest;

  if (!body.userId || !body.old || !body.new) return NextResponse.json({}, { status: 400 });

  const user = await prisma.user.findFirst({
    where: { id: body.userId }
  });

  if (!user) return NextResponse.json({}, { status: 400 });

  const comparison = await comparePassword(body.old, user.password);
  if (!comparison) return NextResponse.json({ code: ErrorsEnum.E_BAD_PASSWORD }, { status: 400 });

  const newPwdHash = await passwordHash(body.new);

  await prisma.user.update({
    where: { id: body.userId },
    data: {
      password: newPwdHash,
      updatedAt: new Date()
    }
  });

  return NextResponse.json({}, { status: 200 });
}
