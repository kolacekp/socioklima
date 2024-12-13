import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { ResultAnswersDto } from '@/models/questionnaires/resultAnswersDto';
import { NextRequest, NextResponse } from 'next/server';
import { AnswerOptionType } from '@/models/questionnaires/answerOptionTypes.enum';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as ResultAnswersDto;
  if (!body || !body.questionnaireId || !body.partId)
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

  const pupil = await prisma.pupil.findFirst({
    where: {
      userId: session.user.id
    }
  });

  if (!pupil) return NextResponse.json({}, { status: 404 });

  let result = await prisma.questionnaireResult.findFirst({
    where: {
      questionnaireId: body.questionnaireId,
      pupilId: pupil.id
    }
  });

  if (result && result.lastCompletedPartId === body.partId)
    return NextResponse.json({ partAlreadyCompleted: true }, { status: 400 });

  if (result) {
    await prisma.questionnaireResult.update({
      where: {
        id: result.id
      },
      data: {
        lastCompletedPartId: body.partId,
        isCompleted: body.isCompleted
      }
    });
  } else {
    result = await prisma.questionnaireResult.create({
      data: {
        questionnaireId: body.questionnaireId,
        lastCompletedPartId: body.partId,
        pupilId: pupil.id,
        isCompleted: body.isCompleted
      }
    });
  }

  if (!result) return NextResponse.json({}, { status: 500 });

  const optionAnswers = body.answers.filter(
    (a) => a.optionType === AnswerOptionType.IMAGE || a.optionType === AnswerOptionType.TEXT
  );

  const pupilAnswers = body.answers.filter((a) => a.optionType === AnswerOptionType.CLASSMATE);

  await Promise.all(
    optionAnswers.map(async (a) => {
      const options = a.options.map((optionId: string) => {
        return { id: optionId };
      });

      await prisma.questionnaireResultAnswer.create({
        data: {
          questionnaireResultId: result!.id,
          questionId: a.questionId,
          pupilId: a.pupilId,
          comment: a.comment,
          answerOptions: {
            connect: options
          }
        }
      });
    })
  );

  await Promise.all(
    pupilAnswers.map(async (a) => {
      const pupils = a.options
        .filter((pupilId) => pupilId !== '0')
        .map((pupilId) => {
          return { id: pupilId };
        });

      await prisma.questionnaireResultAnswer.create({
        data: {
          questionnaireResultId: result!.id,
          questionId: a.questionId,
          comment: a.comment,
          answerPupils: {
            connect: pupils
          }
        }
      });
    })
  );

  return NextResponse.json(
    {
      message: 'Result submitted successfully'
    },
    { status: 200 }
  );
}
