import { prisma } from '@/lib/prisma';
import moment from 'moment';
import { NextRequest, NextResponse } from 'next/server';
import { generatePassword, passwordHash } from '@/utils/passwords';
import { Pupil, User } from '@prisma/client';

export interface ClassGeneratePasswordsRequest {
  classId: string;
}

export interface ClassGeneratePasswordsResponseObject {
  pupilName: string;
  pupilUsername: string;
  password: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request?.json()) as ClassGeneratePasswordsRequest;

  if (!body || !body.classId) return NextResponse.json({}, { status: 400 });

  return await handleGeneratePasswords(body.classId);
}

async function handleGeneratePasswords(classId: string): Promise<NextResponse> {
  const result = new Array<ClassGeneratePasswordsResponseObject>();

  const pupils = await prisma.pupil.findMany({
    where: {
      classId: classId,
      deletedAt: null
    },
    orderBy: {
      number: 'asc'
    },
    include: {
      user: true
    }
  });

  await Promise.all(
    pupils.map(async (p: Pupil & { user: User }) => {
      if (p.user && p.user.id) {
        const password = generatePassword();
        const pwdHash = await passwordHash(password);

        await prisma.user.update({
          where: {
            id: p.user.id
          },
          data: {
            password: pwdHash,
            updatedAt: moment().toDate()
          }
        });

        result.push({
          pupilName: p.user.name,
          pupilUsername: p.user.username,
          password: password
        } as ClassGeneratePasswordsResponseObject);
      }
    })
  );

  return NextResponse.json(result, { status: 200 });
}
