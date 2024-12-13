import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * Cron job to archive classes and questionnaires
 * Runs 1st of November every year
 */
export async function GET() {
  try {
    const archivationDate = new Date(); // 1.11. every year
    archivationDate.setFullYear(archivationDate.getFullYear());
    archivationDate.setMonth(10); // 10 = November
    archivationDate.setDate(1);
    archivationDate.setHours(0, 0, 0, 0);

    if (archivationDate > new Date()) {
      return NextResponse.json({}, { status: 400 });
    }

    const expiredClasses = await prisma.class.findMany({
      where: {
        license: {
          validUntil: {
            lt: archivationDate
          }
        },
        isArchived: false
      },
      include: {
        questionnaires: true
      }
    });

    await prisma.$transaction(
      expiredClasses
        .map((classItem) => {
          // Update the class to set isArchived to true
          const classUpdate = prisma.class.update({
            where: {
              id: classItem.id
            },
            data: {
              isArchived: true
            }
          });

          // Update the questionnaires to set isArchived to true
          const questionnaireUpdates = classItem.questionnaires.map((questionnaire) =>
            prisma.questionnaire.update({
              where: {
                id: questionnaire.id
              },
              data: {
                isArchived: true,
                closedAt: questionnaire.closedAt ?? new Date()
              }
            })
          );

          // Return all updates as a single array of promises
          return [classUpdate, ...questionnaireUpdates];
        })
        .flat()
    );
  } catch (error) {
    return NextResponse.json({}, { status: 500 });
  }

  return NextResponse.json({}, { status: 200 });
}
