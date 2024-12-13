import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ClassFormValues } from 'app/[locale]/dashboard/classes/create/components/createClassForm';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as ClassFormValues;
  if (!body)
    return NextResponse.json(
      {
        isCreated: false,
        error: 'Missing parameters'
      },
      { status: 400 }
    );

  const session = await getServerSession(authOptions);
  if (!session || !session.user)
    return NextResponse.json(
      {
        isCreated: false,
        error: 'User not logged in'
      },
      { status: 401 }
    );

  try {
    await prisma.$transaction(async (tx) => {
      const createdClass = await tx.class.create({
        data: {
          name: body.name,
          grade: parseInt(body.grade),
          licenseId: body.licenseId,
          schoolId: body.schoolId,
          genderRequired: body.genderRequired
        }
      });

      if (createdClass.id === null || createdClass.id === undefined)
        return NextResponse.json(
          {
            isCreated: false,
            error: 'Failed to create license'
          },
          { status: 500 }
        );

      await tx.license.update({
        where: {
          id: body.licenseId
        },
        data: {
          classesRemaining: {
            decrement: 1
          }
        }
      });
    });
  } catch (err) {
    return NextResponse.json({ error: 'Database transaction failure' }, { status: 400 });
  }

  return NextResponse.json(
    {
      isCreated: true
    },
    { status: 200 }
  );
}
