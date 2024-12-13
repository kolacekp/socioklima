import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { isAllowedAccess } from '@/services/session.service';
import { RolesEnum } from '@/models/roles/roles.enum';
import { Role } from '@prisma/client';
import { ChangeManagerFormValues } from 'app/[locale]/dashboard/schools/list/[id]/components/changeManagerModal';

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Check parameters
  const body = (await request.json()) as ChangeManagerFormValues;
  if (!body || !body.schoolId || !body.email)
    return NextResponse.json({ message: 'invalid_parameters' }, { status: 400 });

  // Check if user is allowed
  const isAllowed = await isAllowedAccess([RolesEnum.ADMINISTRATOR]);
  if (!isAllowed) return NextResponse.json({ message: 'unauthorized' }, { status: 401 });

  // Get new contact user
  const user = await prisma.user.findFirst({
    where: {
      email: body.email
    },
    include: {
      roles: true
    }
  });

  if (!user) return NextResponse.json({ message: 'user_not_found' }, { status: 404 });

  // Get school
  let school = await prisma.school.findFirst({
    where: {
      id: body.schoolId
    },
    include: {
      principal: {
        select: {
          user: true
        }
      },
      contactUser: true,
      experts: {
        include: {
          user: true
        }
      }
    }
  });

  if (!school) return NextResponse.json({ message: 'school_not_found' }, { status: 404 });

  // Get old contact user
  const oldManager = await prisma.user.findFirst({
    where: {
      id: school.contactUserId
    },
    include: {
      roles: true
    }
  });

  // Update school contact user
  school = await prisma.school.update({
    where: {
      id: body.schoolId
    },
    data: {
      contactUserId: user.id
    },
    include: {
      principal: {
        select: {
          user: true
        }
      },
      contactUser: true,
      experts: {
        include: {
          user: true
        }
      }
    }
  });

  // Set SCHOOL_MANAGER role to new contact user
  const role = user.roles.find((role: Role) => role.slug === RolesEnum.SCHOOL_MANAGER);

  if (!role) {
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        roles: {
          connect: {
            slug: RolesEnum.SCHOOL_MANAGER
          }
        }
      }
    });
  }

  // If old contact user does not manage other schools, remove SCHOOL_MANAGER role
  if (oldManager) {
    const otherSchools = await prisma.school.findMany({
      where: {
        contactUserId: oldManager.id
      }
    });

    if (otherSchools.length <= 0) {
      await prisma.user.update({
        where: {
          id: oldManager.id
        },
        data: {
          roles: {
            disconnect: {
              slug: RolesEnum.SCHOOL_MANAGER
            }
          }
        }
      });
    }
  }

  return NextResponse.json(school, { status: 200 });
}
