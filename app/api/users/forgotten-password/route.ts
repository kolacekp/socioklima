import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { ErrorsEnum } from '@/utils/errors.enum';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { sendResetPasswordLinkEmail } from '@/services/nodemailer.service';

export interface ForgottenUserPasswordRequest {
  email: string;
  locale: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request?.json()) as ForgottenUserPasswordRequest;

  if (!body || !body.email) return NextResponse.json({}, { status: 400 });

  const user = await prisma.user.findFirst({
    where: { email: body.email }
  });

  if (!user) return NextResponse.json({ code: ErrorsEnum.E_NO_EXISTING_EMAIL }, { status: 400 });

  const passwordResetToken = uuidv4();
  const passwordResetTokenValidTo = moment().add(7, 'days').toDate();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: passwordResetToken,
      passwordResetTokenValidTo: passwordResetTokenValidTo
    }
  });

  if (user.email)
    await sendResetPasswordLinkEmail(user.email, passwordResetToken, passwordResetTokenValidTo, body.locale);

  return NextResponse.json({}, { status: 200 });
}
