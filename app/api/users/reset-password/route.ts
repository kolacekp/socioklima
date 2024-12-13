import { prisma } from '@/lib/prisma';
import { User } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { passwordHash } from '@/utils/passwords';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request?.json()) as {
    passwordResetToken: string;
    password: string;
  };
  const isValid = body?.passwordResetToken && body?.password;

  if (!isValid) {
    return NextResponse.json({ isCreated: false });
  }

  return await handleResetPasswordUser(body.passwordResetToken, body.password);
}

async function handleResetPasswordUser(passwordResetToken: string, password: string): Promise<NextResponse> {
  const pwdHash = await passwordHash(password);
  const user = await updateUser(passwordResetToken, pwdHash);

  if (user?.email && pwdHash === user?.password) {
    //TODO
    //await sendVerificationEmail(user.email, user.verificationToken);

    return NextResponse.json({ isCreated: true });
  }

  return NextResponse.json({ isCreated: false });
}

async function updateUser(passwordResetToken: string, passwordHash: string): Promise<User> {
  return prisma.user.update({
    where: { passwordResetToken: passwordResetToken },
    data: {
      password: passwordHash,
      updatedAt: new Date(),
      passwordResetToken: null,
      passwordResetTokenValidTo: null
    }
  });
}
