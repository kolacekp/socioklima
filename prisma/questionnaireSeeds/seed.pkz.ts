import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
async function main() {
  const typePkz = await prisma.questionnaireType.create({
    data: {
      id: uuidv4(),
      name: 'pkz.name',
      shortName: 'pkz.shortname',
      description: 'pkz.desc',
      linesOfDescription: 5
    }
  });

  const pupilImagesOptions = await prisma.answerOption.findMany({
    where: {
      group: 1
    },
    select: {
      id: true
    }
  });

  const p1q1 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'pkz.questions.1',
      order: 1,
      enableComment: true,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 3,
      answerOptions: {
        connect: pupilImagesOptions
      }
    }
  });

  const p1q2 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'pkz.questions.2',
      order: 2,
      enableComment: true,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 3,
      answerOptions: {
        connect: pupilImagesOptions
      }
    }
  });

  const p1q3 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'pkz.questions.3',
      order: 3,
      enableComment: true,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 3,
      answerOptions: {
        connect: pupilImagesOptions
      }
    }
  });

  const p1q4 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'pkz.questions.4',
      order: 4,
      enableComment: true,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 3,
      answerOptions: {
        connect: pupilImagesOptions
      }
    }
  });

  await prisma.questionnairePart.create({
    data: {
      id: uuidv4(),
      name: 'pkz.parts.1.name',
      description: 'pkz.parts.1.desc',
      order: 1,
      questionnaireTypeId: typePkz.id,
      questions: {
        connect: [p1q1, p1q2, p1q3, p1q4]
      }
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
