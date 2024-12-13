import { prisma } from '@/lib/prisma';
import { AddLicenseFormValues } from 'app/[locale]/dashboard/licenses/create/components/createLicenseForm';
import { NextRequest, NextResponse } from 'next/server';
import { getSessionUserId } from '../../../../services/session.service';
import { sendOrderSuccessToAdmin, sendOrderSuccessToPrincipal } from '@/services/nodemailer.service';
import { RolesEnum } from '@/models/roles/roles.enum';
import { generateInvoiceNumber } from '@/utils/invoiceNumber';
import { getLicensePrice } from '@/utils/licensePrice';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as AddLicenseFormValues;
  if (!body)
    return NextResponse.json(
      {
        isCreated: false,
        error: 'Missing parameters'
      },
      { status: 400 }
    );

  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json(
      {
        isCreated: false,
        error: 'User not found'
      },
      { status: 401 }
    );
  }

  const currentYear = new Date().getFullYear();
  const date = new Date(currentYear, 7, 25);
  if (date < new Date()) {
    date.setFullYear(currentYear + 1);
  }

  const school = await prisma.school.findFirst({
    where: {
      id: body.schoolId,
      deletedAt: null
    },
    select: {
      country: true,
      schoolName: true,
      principal: {
        include: {
          user: true
        }
      }
    }
  });

  if (!school) return NextResponse.json({ isCreated: false }, { status: 404 });

  let price: number;
  if (body.price) {
    price = parseInt(body.price);
  } else {
    price = getLicensePrice(school.country, body.product, body.classesTotal, body.isUnlimited);

    if (price === 0) return NextResponse.json({ isCreated: false }, { status: 400 });
  }

  const invoiceNumber = await generateInvoiceNumber(body.schoolId);

  const license = await prisma.license.create({
    data: {
      validUntil: date,
      classesTotal: body.classesTotal,
      product: body.product,
      price: price,
      generateInvoice: body.generateInvoice,
      schoolId: body.schoolId,
      createdById: userId,
      classesRemaining: body.classesTotal,
      invoiceNumber: invoiceNumber,
      isUnlimited: body.isUnlimited
    }
  });

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

  if (license.id)
    await sendOrderSuccessToPrincipal(
      school.principal?.user.email || '',
      license.id,
      body.product,
      price,
      school.country,
      school.country == 0 ? 'cs' : 'sk'
    );

  admins.map(async (admin) => {
    if (admin.email) {
      await sendOrderSuccessToAdmin(
        admin.email,
        license.id,
        body.product,
        price,
        school.country,
        school.schoolName,
        school.country == 0 ? 'cs' : 'sk'
      );
    }
  });

  return NextResponse.json(
    {
      isCreated: true
    },
    { status: 200 }
  );
}
