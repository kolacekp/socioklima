import { prisma } from '@/lib/prisma';

import { NextRequest, NextResponse } from 'next/server';
import { RolesEnum } from '@/models/roles/roles.enum';
import { sendExpertVerificationCompleteEmail } from '@/services/nodemailer.service';
import { isAllowedAccess } from '@/services/session.service';

export interface ExpertVerifyRequest {
  id: string;
  authorizationNumber: string;
  isVerified: boolean;
  locale: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const permCheck = await isAllowedAccess([RolesEnum.ADMINISTRATOR]);
  if (!permCheck) return NextResponse.json({}, { status: 401 });

  const body = (await request.json()) as ExpertVerifyRequest;
  if (!body || !body.locale)
    return NextResponse.json(
      {
        error: 'Missing parameters'
      },
      { status: 400 }
    );

  const expert = await prisma.expert.update({
    where: {
      id: body.id
    },
    data: {
      authorizationNumber: body.authorizationNumber,
      isVerified: body.isVerified,
      verifiedAt: body.isVerified ? new Date() : null
    },
    include: {
      user: true,
      schools: true
    }
  });

  if (expert && expert.isVerified && expert.user.email)
    await sendExpertVerificationCompleteEmail(expert.user.email, expert.user.username ?? '', body.locale);

  return NextResponse.json(
    {
      expert: expert
    },
    { status: 200 }
  );
}
