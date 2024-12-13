import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { isUserAdmin } from '@/services/session.service';
import { Role, School } from '@prisma/client';
import { RolesEnum } from '@/models/roles/roles.enum';

// Get schools
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user)
    return NextResponse.json(
      {
        error: 'User not logged in'
      },
      { status: 401 }
    );

  const isAdmin = await isUserAdmin(session);
  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email
    },
    include: {
      roles: true
    }
  });
  if (user === null)
    return NextResponse.json(
      {
        error: 'User not found'
      },
      { status: 401 }
    );

  let schools: School[] = [];

  // admin - all schools
  if (isAdmin) {
    schools = await prisma.school.findMany({
      where: {
        deletedAt: null
      }
    });
  } else {
    // we have to figure out if the user is expert or school manager

    const roles = user.roles.map((role: Role) => {
      return role.slug;
    });

    if (roles.includes(RolesEnum.SCHOOL_MANAGER)) {
      schools = await prisma.school.findMany({
        where: {
          contactUserId: user.id,
          deletedAt: null
        }
      });
    }

    if (roles.includes(RolesEnum.EXPERT)) {
      const expert = await prisma.expert.findFirst({
        where: {
          userId: user.id
        },
        include: {
          schools: {
            select: {
              id: true
            }
          }
        }
      });

      if (expert) {
        schools = await prisma.school.findMany({
          where: {
            id: { in: expert.schools.map((s) => s.id) }
          }
        });
      }
    }
  }

  return NextResponse.json(
    {
      schools: schools
    },
    { status: 200 }
  );
}
