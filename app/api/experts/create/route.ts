import { prisma } from '@/lib/prisma';
import { Expert, Role, School, User } from '@prisma/client';
import moment from 'moment/moment';
import { NextRequest, NextResponse } from 'next/server';
import { sendCreateNewExpertEmail, sendNewExpertPasswordEmail } from 'services/nodemailer.service';
import { isAllowedAccess } from 'services/session.service';
import { v4 as uuidv4 } from 'uuid';
import { RolesEnum } from '@/models/roles/roles.enum';
import { ErrorsEnum } from '@/utils/errors.enum';
import { generatePassword, passwordHash } from '@/utils/passwords';

export interface ExpertCreateRequest {
  name: string;
  email: string;
  phone?: string;
  schoolId: string;
  locale: string; // needed for localized e-mail
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const permCheck = await isAllowedAccess([RolesEnum.ADMINISTRATOR, RolesEnum.SCHOOL_MANAGER, RolesEnum.PRINCIPAL]);
  if (!permCheck) return NextResponse.json({}, { status: 401 });

  const body = (await request.json()) as ExpertCreateRequest;
  if (!body || !body.email || !body.schoolId || !body.name)
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
      email: body.email
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

  if (user && user.deletedAt) return NextResponse.json({ code: ErrorsEnum.E_EMAIL_ALREADY_EXISTS }, { status: 400 });

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
        return NextResponse.json({ code: ErrorsEnum.E_EXPERT_FOR_SAME_SCHOOL, userId: user.id }, { status: 400 });
      }
    }

    if (user.expert && roles.includes(RolesEnum.EXPERT)) {
      const schoolsIds = user.expert.schools.map((school: School) => {
        return school.id;
      });
      if (!schoolsIds.includes(body.schoolId)) {
        return NextResponse.json({ code: ErrorsEnum.E_EXPERT_FOR_DIFFERENT_SCHOOL, userId: user.id }, { status: 400 });
      }
    }

    /*
    if (roles.includes(RolesEnum.EXPERT) && userExpert.expert) {
      const schools = userExpert.expert.schools.map((school: School) => {
        return school.id;
      });
      if (!schools.includes(body.schoolId)) {
        const expert = await prisma.expert.update({
          where: {
            id: userExpert.id
          },
          data: {
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
        if (expert) {
          await handleSendEmailAdmins(expert, school.schoolName, body.locale);
          return NextResponse.json(
            {
              expert: expert
            },
            { status: 200 }
          );
        } else {
          return NextResponse.json(
            {
              isCreated: false,
              error: 'Failed to create expert'
            },
            { status: 500 }
          );
        }
      }
    }
    */

    return NextResponse.json({ code: ErrorsEnum.E_EMAIL_ALREADY_EXISTS }, { status: 400 });
  }

  // at first, we need to create user record
  const newUser = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone?.replace(/\s/g, ''),
      password: await passwordHash(generatePassword()),
      passwordResetToken: uuidv4(),
      passwordResetTokenValidTo: moment().add(7, 'days').toDate(),
      roles: {
        connect: { id: expertRole.id }
      }
    }
  });

  if (!newUser) return NextResponse.json({ error: 'User creation failed' }, { status: 500 });

  const expert = await prisma.expert.create({
    data: {
      userId: newUser.id,
      schools: {
        connect: { id: body.schoolId }
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

  if (!expert) return NextResponse.json({ isCreated: false, error: 'Failed to create expert' }, { status: 500 });

  await handleSendEmail(expert, school.schoolName, body.locale);
  await handleSendEmailAdmins(expert, school.schoolName, body.locale);

  return NextResponse.json({ expert: expert }, { status: 200 });
}

async function handleSendEmail(expert: Expert & { user: User }, schoolName: string, locale: string): Promise<void> {
  if (!expert.user.email) return;

  await sendNewExpertPasswordEmail(
    expert.user.email,
    expert.user.passwordResetToken!,
    expert.user.passwordResetTokenValidTo!,
    locale
  );
}

async function handleSendEmailAdmins(
  expert: Expert & { user: User },
  schoolName: string,
  locale: string
): Promise<void> {
  if (!expert.user.email) return;

  const admins = await prisma.user.findMany({
    where: {
      AND: [
        {
          roles: { some: { slug: RolesEnum.ADMINISTRATOR } }
        },
        {
          deletedAt: null
        }
      ]
    },
    include: {
      roles: true
    }
  });

  admins.map(async (admin) => {
    await sendCreateNewExpertEmail(admin.email ?? '', expert.id, schoolName, expert.user.email ?? '', locale);
  });
}
