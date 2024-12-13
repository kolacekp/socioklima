import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { isUserAdmin } from 'services/session.service';
import { Prisma, PrismaClient, Role } from '@prisma/client';
import { RolesEnum } from '@/models/roles/roles.enum';
import { DefaultArgs } from '@prisma/client/runtime/library';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  if (!body || !body.id)
    return NextResponse.json(
      {
        error: 'Missing parameters'
      },
      { status: 400 }
    );

  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  const isAdmin = await isUserAdmin(session!);

  const school = await prisma.school.findFirst({
    where: {
      id: body.id
    },
    include: {
      teachers: true,
      experts: true,
      principal: true,
      licenses: true,
      classes: {
        include: {
          pupils: true
        }
      }
    }
  });

  if (!school) return NextResponse.json({}, { status: 404 });

  if (!isAdmin && userId !== school.contactUserId) {
    return NextResponse.json({}, { status: 401 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.school.update({
        where: {
          id: body.id
        },
        data: {
          deletedAt: new Date()
        }
      });

      // we need to "soft-delete" any school data

      // 1. school manager - only if it is not also admin
      await tx.user.update({
        where: {
          id: school.contactUserId,
          roles: {
            some: {
              NOT: {
                slug: RolesEnum.ADMINISTRATOR
              }
            }
          }
        },
        data: {
          name: null,
          email: 'ucet@byl.smazan',
          deletedAt: new Date()
        }
      });

      // 2. experts
      for (const expert of school.experts) {
        await deleteExpert(expert.id, school.id, tx);
      }

      // 3. teachers
      for (const teacher of school.teachers) {
        await deleteTeacher(teacher.id, tx);
      }

      // 4. classes
      for (const cls of school.classes) {
        await deleteClass(cls.id, tx);
      }

      // 5. principal
      await tx.principal.update({
        where: {
          schoolId: school.id
        },
        data: {
          deletedAt: new Date(),
          user: {
            update: {
              where: {
                roles: {
                  some: {
                    NOT: {
                      slug: RolesEnum.ADMINISTRATOR
                    }
                  }
                }
              },
              data: {
                name: null,
                email: 'ucet@byl.smazan',
                deletedAt: new Date()
              }
            }
          }
        }
      });

      // 6. licenses
      for (const license of school.licenses) {
        await deleteLicense(license.id, tx);
      }
    });
  } catch (err) {
    return NextResponse.json({ error: 'Database transaction failure' }, { status: 400 });
  }

  return NextResponse.json({}, { status: 200 });
}

async function deleteExpert(
  id: string,
  schoolId: string,
  tx: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >
) {
  const updatedExpert = await tx.expert.update({
    where: {
      id: id
    },
    data: {
      schools: {
        disconnect: {
          id: schoolId
        }
      }
    },
    include: {
      user: {
        include: {
          roles: true
        }
      },
      schools: true
    }
  });

  // delete the expert record only if it was it's last school
  if (updatedExpert.schools.length == 0) {
    await tx.expert.update({
      where: {
        id: updatedExpert.id
      },
      data: {
        deletedAt: new Date()
      }
    });
  }

  // delete the user record only if the expert is the only role
  if (
    updatedExpert.user.roles.length == 1 &&
    updatedExpert.user.roles.filter((r: Role) => r.slug == RolesEnum.EXPERT).length
  )
    await tx.user.update({
      where: {
        id: updatedExpert.userId
      },
      data: {
        name: null,
        email: 'ucet@byl.smazan',
        deletedAt: new Date()
      }
    });
}

async function deleteTeacher(
  id: string,
  tx: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >
) {
  const updatedTeacher = await tx.teacher.update({
    where: {
      id: id
    },
    data: {
      deletedAt: new Date()
    },
    include: {
      user: {
        include: {
          roles: true
        }
      }
    }
  });

  // delete the user record only if the teacher is the only role
  if (
    updatedTeacher.user.roles.length == 1 &&
    updatedTeacher.user.roles.filter((r: Role) => r.slug == RolesEnum.TEACHER).length
  )
    await tx.user.update({
      where: {
        id: updatedTeacher.userId
      },
      data: {
        name: null,
        email: 'ucet@byl.smazan',
        deletedAt: new Date()
      }
    });
}

async function deleteClass(
  id: string,
  tx: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >
) {
  await tx.class.update({
    where: {
      id: id
    },
    data: {
      pupils: {
        updateMany: {
          where: {
            deletedAt: null
          },
          data: {
            deletedAt: new Date()
          }
        }
      },
      deletedAt: new Date()
    }
  });

  // update user records - set them as deleted
  const deletedPupils = await tx.pupil.findMany({
    where: {
      classId: id,
      NOT: [
        {
          deletedAt: null
        }
      ]
    },
    include: {
      user: {
        select: {
          id: true
        }
      }
    }
  });

  await tx.user.updateMany({
    where: {
      id: {
        in: deletedPupils.map((p) => p.user.id)
      },
      deletedAt: null
    },
    data: {
      deletedAt: new Date()
    }
  });
}

async function deleteLicense(
  id: string,
  tx: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >
) {
  await tx.license.update({
    where: {
      id: id
    },
    data: {
      deletedAt: new Date()
    }
  });
}
