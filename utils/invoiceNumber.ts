import { prisma } from '@/lib/prisma';

export async function generateInvoiceNumber(schoolId: string): Promise<number> {
  const school = await prisma.school.findFirst({
    where: {
      id: schoolId,
      deletedAt: null
    }
  });
  if (!school) return 0;

  const currentYear = new Date().getFullYear();
  const country = school.country + 1;
  let invoiceNumber = Number(currentYear.toString() + country.toString() + '001');

  const compareDate = new Date(currentYear, 0, 1);
  const licenses = await prisma.license.findMany({
    where: {
      createdAt: {
        gte: compareDate
      },
      school: {
        country: school.country
      }
    },
    orderBy: {
      invoiceNumber: 'asc'
    },
    take: 1
  });

  licenses.forEach((license) => {
    if (license.invoiceNumber === invoiceNumber) {
      invoiceNumber = invoiceNumber + 1;
    }
  });

  let existingLicense = await prisma.license.findFirst({
    where: {
      invoiceNumber: invoiceNumber
    }
  });

  while (existingLicense) {
    invoiceNumber = invoiceNumber + 1;
    existingLicense = await prisma.license.findFirst({
      where: {
        invoiceNumber: invoiceNumber
      }
    });
  }

  return invoiceNumber;
}
