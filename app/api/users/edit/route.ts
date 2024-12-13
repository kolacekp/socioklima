import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { isAllowedAccess } from 'services/session.service';

import { RolesEnum } from '@/models/roles/roles.enum';
import { EditUserFormValues } from 'app/[locale]/dashboard/users/[id]/components/userDetailForm';

export async function POST(request: NextRequest) {
  const allowedAccess = await isAllowedAccess([RolesEnum.ADMINISTRATOR]);
  if (!allowedAccess) return NextResponse.json({}, { status: 401 });

  const body = (await request.json()) as EditUserFormValues;
  if (!body || !body.id)
    return NextResponse.json(
      {
        error: 'Missing parameters'
      },
      { status: 400 }
    );

  let user = await prisma.user.findFirst({
    where: { id: body.id }
  });
  if (!user) return NextResponse.json({}, { status: 404 });

  user = await prisma.user.update({
    where: { id: body.id },
    data: {
      name: body.name,
      phone: body.phone,
      updatedAt: new Date()
    }
  });

  return NextResponse.json(user, { status: 200 });
}
