import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Class, Teacher, User } from '@prisma/client';
import ContentNotAllowed from '../../components/contentNotAllowed';
import { ClassListDto } from 'models/classes/classList.dto';
import { getServerSession } from 'next-auth';
import { getUserRoles, isAllowedAccess, isUserOnlyUnverifiedExpert } from 'services/session.service';
import { RolesEnum } from '@/models/roles/roles.enum';
import NoSchoolSelected from '../../components/noSchoolSelected';
import ClassList from './components/classList';
import { getTranslations } from 'next-intl/server';
import UnverifiedExpert from '../../components/unverifiedExpert';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'dashboard.classes.list' });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

interface ClassWithTeacherAndLicense extends Class {
  teacher: Teacher & {
    user: User;
    classes: Class[];
  };
  license: {
    id: string;
    validFrom: Date;
    validUntil: Date;
    product: number;
    schoolId: string;
    deletedAt: Date | null;
    isPaid: boolean;
  };
}

interface TeacherWithClassesAndTeacherAndLicense extends Teacher {
  classes: ClassWithTeacherAndLicense[];
}

async function getSchoolClasses(schoolId: string) {
  return (await prisma.class.findMany({
    include: {
      teacher: {
        where: {
          deletedAt: null
        },
        include: {
          user: {
            select: {
              name: true
            }
          },
          classes: {
            where: {
              deletedAt: null
            }
          }
        }
      },
      license: {
        select: {
          id: true,
          validFrom: true,
          validUntil: true,
          product: true,
          schoolId: true,
          deletedAt: true,
          isPaid: true
        }
      }
    },
    where: {
      schoolId: schoolId,
      deletedAt: null
    }
  })) as ClassWithTeacherAndLicense[];
}

async function getTeacherWithClasses(userId: string) {
  return (await prisma.teacher.findFirst({
    where: {
      userId: userId,
      deletedAt: null
    },
    include: {
      classes: {
        where: {
          deletedAt: null
        },
        include: {
          teacher: {
            where: {
              deletedAt: null
            },
            include: {
              user: {
                select: {
                  name: true
                }
              },
              classes: {
                where: {
                  deletedAt: null
                }
              }
            }
          },
          license: {
            select: {
              id: true,
              validFrom: true,
              validUntil: true,
              product: true,
              schoolId: true,
              deletedAt: true,
              isPaid: true
            }
          }
        }
      }
    }
  })) as TeacherWithClassesAndTeacherAndLicense;
}

export default async function ClassListPage() {
  const allowedRoles = [
    RolesEnum.ADMINISTRATOR,
    RolesEnum.SCHOOL_MANAGER,
    RolesEnum.EXPERT,
    RolesEnum.PRINCIPAL,
    RolesEnum.TEACHER
  ];
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id || !(await isAllowedAccess(allowedRoles)))
    return <ContentNotAllowed />;

  const isUserOnlyUnverifiedExpertCheck = await isUserOnlyUnverifiedExpert(session);
  if (isUserOnlyUnverifiedExpertCheck) return <UnverifiedExpert />;

  if (!session.user.activeSchool?.id) return <NoSchoolSelected />;

  let classes: ClassWithTeacherAndLicense[];

  const roles = await getUserRoles(session);
  if (
    roles.includes(RolesEnum.ADMINISTRATOR) ||
    roles.includes(RolesEnum.SCHOOL_MANAGER) ||
    roles.includes(RolesEnum.PRINCIPAL) ||
    roles.includes(RolesEnum.EXPERT)
  ) {
    classes = await getSchoolClasses(session.user.activeSchool.id);
  } else {
    classes = (await getTeacherWithClasses(session.user.id)).classes;
  }

  const classesDto: ClassListDto[] = [];

  for (const cls of classes) {
    const pupils = await prisma.pupil.findMany({
      where: {
        deletedAt: null,
        classId: cls.id
      }
    });
    classesDto.push({
      ...cls,
      pupilCount: pupils.length
    });
  }

  const isAdminOrManager =
    roles.includes(RolesEnum.ADMINISTRATOR) ||
    roles.includes(RolesEnum.SCHOOL_MANAGER) ||
    roles.includes(RolesEnum.PRINCIPAL);

  return (
    <>
      <ClassList classList={classesDto} isAdminOrManager={isAdminOrManager} />
    </>
  );
}
