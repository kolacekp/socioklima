import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { isAllowedAccess } from 'services/session.service';

import { RolesEnum } from '../../../../models/roles/roles.enum';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const licenseId = request.nextUrl.searchParams.get('id');
  const value = request.nextUrl.searchParams.get('value');

  if (!licenseId) {
    return NextResponse.json(
      {
        toggled: false,
        error: 'Missing License ID Parameter'
      },
      { status: 400 }
    );
  }

  if (!value) {
    return NextResponse.json(
      {
        toggled: false,
        error: 'Missing Value Parameter'
      },
      { status: 400 }
    );
  }

  const isAdmin = await isAllowedAccess([RolesEnum.ADMINISTRATOR]);
  if (!isAdmin) {
    return NextResponse.json(
      {
        toggled: false,
        error: 'Access denied'
      },
      { status: 403 }
    );
  }

  await prisma.license.update({
    where: { id: licenseId },
    data: {
      isPaid: value === 'true'
    }
  });

  return NextResponse.json({ changed: true }, { status: 200 });
}
