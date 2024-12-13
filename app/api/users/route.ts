import { prisma } from '@/lib/prisma';
import { Role, User } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { isAllowedAccess } from 'services/session.service';

import { RolesEnum } from '@/models/roles/roles.enum';

export async function POST(request: NextRequest) {
  const allowedAccess = await isAllowedAccess([RolesEnum.ADMINISTRATOR]);

  if (!allowedAccess) return NextResponse.json({});

  const body = (await request.json()) as User & { roles: Role[] };
  if (body) {
    // at first delete current user roles
    await prisma.user.update({
      where: { id: body.id },
      data: {
        roles: {
          set: []
        }
      }
    });

    const rolesToConnect = await prisma.role.findMany({
      where: {
        id: { in: body.roles.map((r) => r.id) }
      },
      select: {
        id: true
      }
    });

    const user = await prisma.user.update({
      where: { id: body.id },
      data: {
        username: body.username,
        name: body.name,
        updatedAt: new Date(),
        roles: {
          connect: rolesToConnect
        }
      },
      include: {
        roles: true
      }
    });
    return NextResponse.json(user);
  }
  return NextResponse.json({});
}
