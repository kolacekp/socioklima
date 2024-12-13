import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { RolesEnum } from '@/models/roles/roles.enum';
import { getSessionUserId, isAllowedAccess } from '@/services/session.service';
import { generatePassword, passwordHash } from '@/utils/passwords';
import {
  sendSchoolRegisteredEmailToAdmin,
  sendSchoolRegisteredEmailToManager,
  sendSchoolRegisteredEmailToPrincipal
} from '@/services/nodemailer.service';

export interface SchoolRegistrationRequest {
  businessIdSearch?: string;
  country: number;
  schoolName: string;
  address: string;
  city: string;
  zipCode: string;
  businessId: string;
  taxNumber: string;
  billingInfoEqual: boolean;
  billingName: string;
  billingAddress: string;
  billingCity: string;
  billingZipCode: string;
  billingBusinessId: string;
  billingTaxNumber: string;
  schoolType: number;
  website: string;
  principalName: string;
  principalPhone: string;
  principalEmail: string;
  locale: string;
}

// School registration
export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as SchoolRegistrationRequest;
  if (!body) return NextResponse.json({ isCreated: false, error: 'Missing parameters' }, { status: 400 });

  const permCheck = await isAllowedAccess([RolesEnum.ADMINISTRATOR, RolesEnum.SCHOOL_MANAGER, RolesEnum.PRINCIPAL]);
  if (!permCheck) return NextResponse.json({}, { status: 401 });

  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ isCreated: false, error: 'User not found' }, { status: 401 });
  }

  const role = await prisma.role.findFirst({
    where: { slug: RolesEnum.PRINCIPAL }
  });

  if (!role) return NextResponse.json({ isCreated: false, error: 'Principal role is not defined' }, { status: 500 });

  // we will need to return the password only once to display it to the administrator
  const userPassword = generatePassword();

  // at first, we need to create user record
  let user = await prisma.user.findFirst({
    where: {
      email: body.principalEmail,
      deletedAt: null
    }
  });

  if (user) {
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        roles: {
          connect: { id: role.id }
        }
      }
    });
  } else {
    user = await prisma.user.create({
      data: {
        name: body.principalName,
        email: body.principalEmail,
        phone: body.principalPhone?.replace(/\s/g, ''),
        password: await passwordHash(userPassword),
        roles: {
          connect: { id: role.id }
        }
      }
    });
  }

  if (!user)
    return NextResponse.json(
      {
        isCreated: false,
        error: 'User creation failed'
      },
      { status: 500 }
    );

  const existingSchool = await prisma.school.findFirst({
    where: { businessId: body.businessId, deletedAt: null },
    include: {
      contactUser: {
        select: {
          email: true
        }
      }
    }
  });

  if (existingSchool)
    return NextResponse.json(
      {
        isCreated: false,
        error: 'School already exists',
        message: `Profil školy již existuje. Kontakt na správce školy: ${existingSchool.contactUser.email}`
      },
      { status: 409 }
    );

  const school = await prisma.school.create({
    data: {
      country: Number(body.country),
      schoolName: body.schoolName,
      address: body.address,
      city: body.city,
      zipCode: body.zipCode,
      businessId: body.businessId,
      taxNumber: body.taxNumber || null,
      billingInfoEqual: body.billingInfoEqual,
      billingName: body.billingName || null,
      billingAddress: body.billingAddress || null,
      billingCity: body.billingCity || null,
      billingZipCode: body.billingZipCode || null,
      billingBusinessId: body.billingBusinessId || null,
      billingTaxNumber: body.billingTaxNumber || null,
      schoolType: body.schoolType,
      website: body.website || null,
      contactUserId: userId
    }
  });

  if (!school.id) return NextResponse.json({ isCreated: false, error: 'School not created' }, { status: 500 });

  let principal = await prisma.principal.findFirst({
    where: {
      userId: user.id,
      deletedAt: null
    },
    include: {
      user: true
    }
  });

  if (!principal) {
    principal = await prisma.principal.create({
      data: {
        userId: user.id,
        schoolId: school.id
      },
      include: {
        user: true
      }
    });
  }

  if (!principal.id) return NextResponse.json({ isCreated: false, error: 'Principal not created' }, { status: 500 });

  // email to principal
  if (principal.user && principal.user.email)
    await sendSchoolRegisteredEmailToPrincipal(
      principal.user.email,
      school.schoolName,
      school.businessId,
      body.locale,
      school.country == 0 ? 'cs' : 'sk'
    );

  // email to school manager
  const schoolManager = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null }
  });

  if (schoolManager && schoolManager.email)
    await sendSchoolRegisteredEmailToManager(schoolManager.email, school.schoolName, school.businessId, body.locale);

  // email to admins
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
    }
  });

  admins.map(async (admin) => {
    if (admin.email)
      await sendSchoolRegisteredEmailToAdmin(
        admin.email,
        school.id,
        school.schoolName,
        school.businessId,
        school.country == 0 ? 'cs' : 'sk'
      );
  });

  return NextResponse.json({ isCreated: true }, { status: 200 });
}
