import { prisma } from '@/lib/prisma';
import { Role, School } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { isAllowedAccess } from 'services/session.service';
import { RolesEnum } from '@/models/roles/roles.enum';

export interface ExpertExtendRequest {
  userId: string;
  schoolId: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const permCheck = await isAllowedAccess([RolesEnum.ADMINISTRATOR, RolesEnum.SCHOOL_MANAGER, RolesEnum.PRINCIPAL]);
  if (!permCheck) return NextResponse.json({}, { status: 401 });

  const body = (await request.json()) as ExpertExtendRequest;
  if (!body || !body.userId || !body.schoolId)
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });

  // existing expert role check
  const expertRole = await prisma.role.findFirst({
    where: { slug: RolesEnum.EXPERT }
  });

  if (!expertRole) return NextResponse.json({ error: 'Expert role is not defined' }, { status: 500 });

  // existing school check
  const school = await prisma.school.findFirst({
    where: { id: body.schoolId }
  });

  if (!school) return NextResponse.json({ error: 'Non existing school' }, { status: 500 });

  // we need to check if the email already exists
  const user = await prisma.user.findFirst({
    where: {
      id: body.userId
    },
    include: {
      roles: true,
      principal: true,
      expert: {
        include: {
          schools: true
        }
      }
    }
  });

  // if there is an expert for different school, we will add the expert to this school also
  // or if the email is already existing, and it is a manager or principal of this school, we wil allow him also to become an expert
  if (user) {
    const roles = user.roles.map((role: Role) => {
      return role.slug;
    });

    // if the expert record does not exist - it is the school manager or principal, but we have to check the school id
    if (!user.expert && !roles.includes(RolesEnum.EXPERT)) {
      if (
        (user.principal && user.principal.schoolId == body.schoolId) ||
        (roles.includes(RolesEnum.SCHOOL_MANAGER) && school.contactUserId == user.id)
      ) {
        // add expert role to user record
        await prisma.user.update({
          where: { id: user.id },
          data: {
            updatedAt: new Date(),
            roles: {
              connect: { id: expertRole.id }
            }
          }
        });

        // create expert record
        const expert = await prisma.expert.create({
          data: {
            user: {
              connect: { id: user.id }
            },
            schools: {
              connect: { id: body.schoolId }
            }
          },
          include: {
            user: {
              include: {
                roles: true
              }
            }
          }
        });

        if (!expert) return NextResponse.json({ isCreated: false, error: 'Failed to create expert' }, { status: 500 });

        return NextResponse.json({ expert: expert }, { status: 200 });
      }
    }

    if (user.expert && roles.includes(RolesEnum.EXPERT)) {
      const schoolsIds = user.expert.schools.map((school: School) => {
        return school.id;
      });
      if (!schoolsIds.includes(body.schoolId)) {
        const expert = await prisma.expert.update({
          where: {
            id: user.expert.id
          },
          data: {
            schools: {
              connect: { id: body.schoolId }
            },
            updatedAt: new Date()
          },
          include: {
            user: {
              include: {
                roles: true
              }
            }
          }
        });

        if (!expert) return NextResponse.json({ isCreated: false, error: 'Failed to create expert' }, { status: 500 });

        return NextResponse.json({ expert: expert }, { status: 200 });
      }
    }

    return NextResponse.json({ message: 'Expert user is already existing' }, { status: 400 });
  }

  return NextResponse.json({ message: 'User does not exist' }, { status: 400 });
}
