import { prisma } from '@/lib/prisma';

import { NextRequest, NextResponse } from 'next/server';
import { RolesEnum } from '@/models/roles/roles.enum';
import { isAllowedAccess } from '@/services/session.service';
import { ErrorsEnum } from '@/utils/errors.enum';

export interface ExpertUpdateRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  userId: string;
  locale: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const permCheck = await isAllowedAccess([RolesEnum.ADMINISTRATOR, RolesEnum.SCHOOL_MANAGER, RolesEnum.PRINCIPAL]);
  if (!permCheck) return NextResponse.json({}, { status: 401 });

  const body = (await request.json()) as ExpertUpdateRequest;
  if (!body || !body.email || !body.name || !body.locale)
    return NextResponse.json(
      {
        error: 'Missing parameters'
      },
      { status: 400 }
    );

  // we need to check if the email already exists
  const userWithEmail = await prisma.user.findFirst({
    where: {
      email: body.email,
      id: { not: body.userId }
    }
  });

  if (userWithEmail) return NextResponse.json({ code: ErrorsEnum.E_EMAIL_ALREADY_EXISTS }, { status: 400 });

  const expert = await prisma.expert.update({
    where: {
      id: body.id
    },
    data: {
      user: {
        update: {
          data: {
            name: body.name,
            email: body.email,
            phone: body.phone?.replace(/\s/g, ''),
            updatedAt: new Date()
          }
        }
      }
    },
    include: {
      user: true,
      schools: true
    }
  });

  return NextResponse.json(
    {
      expert: expert
    },
    { status: 200 }
  );
}
