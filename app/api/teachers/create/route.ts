import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { RolesEnum } from '@/models/roles/roles.enum';
import { isAllowedAccess } from '@/services/session.service';
import { ErrorsEnum } from '@/utils/errors.enum';
import { generatePassword, passwordHash } from '@/utils/passwords';

export interface TeacherCreateRequest {
  name: string;
  email: string;
  schoolId: string;
  phone?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const permCheck = await isAllowedAccess([RolesEnum.ADMINISTRATOR, RolesEnum.SCHOOL_MANAGER, RolesEnum.PRINCIPAL]);
  if (!permCheck) return NextResponse.json({}, { status: 401 });

  const body = (await request.json()) as TeacherCreateRequest;
  if (!body || !body.name || !body.email || !body.schoolId)
    return NextResponse.json(
      {
        isCreated: false,
        error: 'Missing parameters'
      },
      { status: 400 }
    );

  const role = await prisma.role.findFirst({
    where: {
      slug: RolesEnum.TEACHER
    }
  });

  if (!role)
    return NextResponse.json(
      {
        isCreated: false,
        error: 'Teacher role is not defined'
      },
      { status: 500 }
    );

  // we need to check if the email already exists
  const userWithEmail = await prisma.user.findFirst({
    where: {
      email: body.email
    }
  });
  if (userWithEmail) return NextResponse.json({ code: ErrorsEnum.E_EMAIL_ALREADY_EXISTS }, { status: 400 });

  // we will need to return the password only once to display it to the administrator
  const userPassword = generatePassword();

  // at first, we need to create user record
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone?.replace(/\s/g, ''),
      password: await passwordHash(userPassword),
      roles: {
        connect: { id: role.id }
      }
    }
  });

  if (!user)
    return NextResponse.json(
      {
        isCreated: false,
        error: 'User creation failed'
      },
      { status: 500 }
    );

  const teacher = await prisma.teacher.create({
    data: {
      userId: user.id,
      schoolId: body.schoolId
    },
    include: {
      user: true,
      classes: true
    }
  });

  if (!teacher)
    return NextResponse.json(
      {
        isCreated: false,
        error: 'Failed to create teacher'
      },
      { status: 500 }
    );

  return NextResponse.json(
    {
      teacher: {
        ...teacher,
        user: user
      },
      password: userPassword
    },
    { status: 200 }
  );
}
