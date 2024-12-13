import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { isUserAdmin } from '@/services/session.service';
import { EditSchoolFormValues } from 'app/[locale]/dashboard/schools/list/[id]/components/schoolEditModal';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as EditSchoolFormValues;
  if (!body || !body.id)
    return NextResponse.json(
      {
        error: 'Missing parameters'
      },
      { status: 400 }
    );

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) return NextResponse.json({}, { status: 401 });

  const isAdmin = await isUserAdmin(session);
  if (!isAdmin) return NextResponse.json({}, { status: 401 });

  let school = await prisma.school.findFirst({
    where: {
      id: body.id
    }
  });
  if (!school) return NextResponse.json({}, { status: 404 });

  school = await prisma.school.update({
    where: {
      id: body.id
    },
    data: {
      schoolName: body.schoolName,
      address: body.address,
      city: body.city,
      zipCode: body.zipCode,
      businessId: body.businessId,
      taxNumber: body.taxNumber,
      country: body.country,
      billingInfoEqual: body.billingInfoEqual,
      billingName: body.billingName,
      billingAddress: body.billingAddress,
      billingCity: body.billingCity,
      billingZipCode: body.billingZipCode,
      billingBusinessId: body.billingBusinessId,
      billingTaxNumber: body.billingTaxNumber,
      schoolType: body.schoolType,
      website: body.website
    },
    include: {
      principal: {
        select: {
          user: true
        }
      },
      contactUser: true,
      experts: {
        include: {
          user: true
        }
      }
    }
  });

  return NextResponse.json(school, { status: 200 });
}
