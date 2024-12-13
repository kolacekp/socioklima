import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { generatePassword, passwordHash } from '@/utils/passwords';
import { generateUsername } from 'utils/usernames';

import { RolesEnum } from '@/models/roles/roles.enum';

export interface PupilCreateRequest {
  classId: string;
  name: string;
  number: string;
  gender: number;
  nationality: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as PupilCreateRequest;
  if (!body)
    return NextResponse.json(
      {
        message: 'Missing parameters'
      },
      { status: 400 }
    );

  const session = await getServerSession(authOptions);
  if (!session || !session.user)
    return NextResponse.json(
      {
        message: 'User not logged in'
      },
      { status: 401 }
    );

  const role = await prisma.role.findFirst({
    where: {
      slug: RolesEnum.PUPIL
    }
  });

  if (!role)
    return NextResponse.json(
      {
        message: 'Pupil role is not defined'
      },
      { status: 500 }
    );

  const userPassword = generatePassword();

  const user = await prisma.user.create({
    data: {
      name: body.name,
      password: await passwordHash(userPassword),
      username: await generateUsername(body.name),
      roles: {
        connect: { id: role.id }
      }
    }
  });

  if (!user)
    return NextResponse.json(
      {
        message: 'User creation failed'
      },
      { status: 500 }
    );

  let nextNumber;
  if (!parseInt(body.number)) {
    const lastNumber = await prisma.pupil.findMany({
      where: {
        classId: body.classId
      },
      select: {
        number: true
      },
      orderBy: {
        number: 'desc'
      },
      take: 1
    });

    if (lastNumber.length > 0) {
      nextNumber = lastNumber[0].number + 1;
    } else {
      nextNumber = 1;
    }
  }

  const pupil = await prisma.pupil.create({
    data: {
      userId: user.id,
      number: parseInt(body.number) || nextNumber!,
      classId: body.classId,
      gender: body.gender,
      nationality: body.nationality || null
    },
    include: {
      user: true
    }
  });

  if (!pupil)
    return NextResponse.json(
      {
        message: 'Failed to create pupil'
      },
      { status: 500 }
    );

  return NextResponse.json(
    {
      password: userPassword,
      message: 'Pupil created',
      pupil: pupil
    },
    { status: 200 }
  );
}
