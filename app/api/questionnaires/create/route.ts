import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { CreateQuestionnaireFormValues } from 'app/[locale]/dashboard/questionnaires/create/components/createQuestionnaireForm';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as CreateQuestionnaireFormValues;
  if (!body || !body.classId)
    return NextResponse.json(
      {
        message: 'Missing parameters'
      },
      { status: 400 }
    );

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id)
    return NextResponse.json(
      {
        message: 'User not logged in'
      },
      { status: 401 }
    );

  const pupils = await prisma.pupil.findMany({
    where: {
      classId: body.classId,
      deletedAt: null
    }
  });

  const questionnaire = await prisma.questionnaire.create({
    data: {
      classId: body.classId,
      schoolId: body.schoolId,
      createdById: session.user.id,
      questionnaireTypeId: body.questionnaireTypeId
    }
  });

  for (const pupil of pupils) {
    await prisma.pupilToQuestionnaire.create({
      data: {
        pupilId: pupil.id,
        questionnaireId: questionnaire.id,
        consent: pupil.consent
      }
    });
  }

  return NextResponse.json(
    {
      message: 'Questionnaire created successfully'
    },
    { status: 200 }
  );
}
