import { prisma } from '@/lib/prisma';
import { Role, School } from '@prisma/client';
import { RolesEnum } from 'models/roles/roles.enum';

export async function GetActiveSchool(userId: string): Promise<School | null> {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null
    },
    include: {
      roles: true
    }
  });
  if (!user) return null;

  const roles = user.roles.map((role: Role) => {
    return role.slug;
  });

  // Admin | Expert: school where id = activeSchoolId from user.db || null
  if (roles.includes(RolesEnum.ADMINISTRATOR) || roles.includes(RolesEnum.EXPERT)) {
    if (user.activeSchoolId) {
      const school = await prisma.school.findFirst({
        where: {
          id: user.activeSchoolId,
          deletedAt: null
        }
      });
      return school;
    }
    return null;
  }

  // Pupil: school from pupil.db
  if (roles.includes(RolesEnum.PUPIL)) {
    const pupil = await prisma.pupil.findFirst({
      where: {
        userId: userId,
        deletedAt: null
      },
      include: {
        class: {
          include: {
            school: true
          }
        }
      }
    });
    if (!pupil?.class.school) return null;
    return pupil.class.school;
  }

  // Principal: school from principal.db
  if (roles.includes(RolesEnum.PRINCIPAL)) {
    const principal = await prisma.principal.findFirst({
      where: {
        userId: userId,
        deletedAt: null
      },
      include: {
        school: true
      }
    });
    if (!principal) return null;
    return principal.school;
  }

  // Teacher: school from teacher.db
  if (roles.includes(RolesEnum.TEACHER)) {
    const teacher = await prisma.teacher.findFirst({
      where: {
        userId: userId
      },
      include: {
        school: true
      }
    });
    if (!teacher) return null;
    return teacher.school;
  }

  // SchoolManager: school where id = activeSchoolId from user.db || first school where contactUserId = userId
  if (roles.includes(RolesEnum.SCHOOL_MANAGER)) {
    if (user.activeSchoolId) {
      const school = await prisma.school.findFirst({
        where: {
          id: user.activeSchoolId,
          deletedAt: null
        }
      });
      return school;
    }
    const school = await prisma.school.findFirst({
      where: {
        contactUserId: userId,
        deletedAt: null
      }
    });
    return school;
  }

  return null;
}
