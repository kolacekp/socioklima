import { prisma } from '@/lib/prisma';
import { RolesEnum } from '@/models/roles/roles.enum';
import { isAllowedAccess } from '@/services/session.service';
import { NextRequest, NextResponse } from 'next/server';

interface ClassUpdateRequest {
  id: string;
  name?: string;
  grade?: number;
  licenseId?: string;
  genderRequired?: boolean;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const permCheck = await isAllowedAccess([RolesEnum.ADMINISTRATOR, RolesEnum.SCHOOL_MANAGER, RolesEnum.PRINCIPAL]);
  if (!permCheck) return NextResponse.json({}, { status: 401 });

  const body = (await request.json()) as ClassUpdateRequest;
  if (!body || !body.id)
    return NextResponse.json(
      {
        error: 'Missing parameters'
      },
      { status: 400 }
    );

  body.grade = Number(body.grade);

  const classToUpdate = await prisma.class.findFirst({
    where: {
      id: body.id
    }
  });

  if (!classToUpdate) {
    return NextResponse.json(
      {
        error: 'Class not found'
      },
      { status: 404 }
    );
  }

  if (classToUpdate.isArchived) {
    return NextResponse.json(
      {
        error: 'Class is archived'
      },
      { status: 400 }
    );
  }

  let updatedClass = await prisma.class.update({
    where: {
      id: body.id
    },
    data: {
      isArchived: false,
      ...body
    },
    include: {
      license: true
    }
  });

  if (body.licenseId) {
    const license = await prisma.license.findFirst({
      where: {
        id: body.licenseId
      }
    });

    if (!license) {
      return NextResponse.json(
        {
          error: 'License not found'
        },
        { status: 404 }
      );
    }

    await prisma.license.update({
      where: {
        id: body.licenseId
      },
      data: {
        classesRemaining: license.classesRemaining - 1
      }
    });

    const newClass = await prisma.class.findFirst({
      where: {
        id: body.id
      },
      include: {
        license: true
      }
    });

    if (newClass) updatedClass = newClass;
  }

  return NextResponse.json({ class: updatedClass }, { status: 200 });
}
