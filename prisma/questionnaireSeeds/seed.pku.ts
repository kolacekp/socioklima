import { AnswerOptionType } from '../../models/questionnaires/answerOptionTypes.enum';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
async function main() {
  const typePku = await prisma.questionnaireType.create({
    data: {
      id: uuidv4(),
      name: 'pku.name',
      shortName: 'pku.shortname',
      description: 'pku.desc',
      linesOfDescription: 5
    }
  });

  await prisma.answerOption.createMany({
    data: [
      {
        id: uuidv4(),
        name: 'options.teachers.UA1',
        imgUrl: '/images/questionnaires/teachers/UA1.png',
        value: 'UA1',
        category: 'UA',
        group: 2,
        type: AnswerOptionType.IMAGE
      },
      {
        id: uuidv4(),
        name: 'options.teachers.UA2',
        imgUrl: '/images/questionnaires/teachers/UA2.png',
        value: 'UA2',
        category: 'UA',
        group: 2,
        type: AnswerOptionType.IMAGE
      },
      {
        id: uuidv4(),
        name: 'options.teachers.UA3',
        imgUrl: '/images/questionnaires/teachers/UA3.png',
        value: 'UA3',
        category: 'UA',
        group: 2,
        type: AnswerOptionType.IMAGE
      },
      {
        id: uuidv4(),
        name: 'options.teachers.UA4',
        imgUrl: '/images/questionnaires/teachers/UA4.png',
        value: 'UA4',
        category: 'UA',
        group: 2,
        type: AnswerOptionType.IMAGE
      },
      {
        id: uuidv4(),
        name: 'options.teachers.UB1',
        imgUrl: '/images/questionnaires/teachers/UB1.png',
        value: 'UB1',
        category: 'UB',
        group: 2,
        type: AnswerOptionType.IMAGE
      },
      {
        id: uuidv4(),
        name: 'options.teachers.UB2',
        imgUrl: '/images/questionnaires/teachers/UB2.png',
        value: 'UB2',
        category: 'UB',
        group: 2,
        type: AnswerOptionType.IMAGE
      },
      {
        id: uuidv4(),
        name: 'options.teachers.UB3',
        imgUrl: '/images/questionnaires/teachers/UB3.png',
        value: 'UB3',
        category: 'UB',
        group: 2,
        type: AnswerOptionType.IMAGE
      },
      {
        id: uuidv4(),
        name: 'options.teachers.UB4',
        imgUrl: '/images/questionnaires/teachers/UB4.png',
        value: 'UB4',
        category: 'UB',
        group: 2,
        type: AnswerOptionType.IMAGE
      },
      {
        id: uuidv4(),
        name: 'options.teachers.UC1',
        imgUrl: '/images/questionnaires/teachers/UC1.png',
        value: 'UC1',
        category: 'UC',
        group: 2,
        type: AnswerOptionType.IMAGE
      },
      {
        id: uuidv4(),
        name: 'options.teachers.UC2',
        imgUrl: '/images/questionnaires/teachers/UC2.png',
        value: 'UC2',
        category: 'UC',
        group: 2,
        type: AnswerOptionType.IMAGE
      },
      {
        id: uuidv4(),
        name: 'options.teachers.UC3',
        imgUrl: '/images/questionnaires/teachers/UC3.png',
        value: 'UC3',
        category: 'UC',
        group: 2,
        type: AnswerOptionType.IMAGE
      },
      {
        id: uuidv4(),
        name: 'options.teachers.UC4',
        imgUrl: '/images/questionnaires/teachers/UC4.png',
        value: 'UC4',
        category: 'UC',
        group: 2,
        type: AnswerOptionType.IMAGE
      },
      {
        id: uuidv4(),
        name: 'options.teachers.UD1',
        imgUrl: '/images/questionnaires/teachers/UD1.png',
        value: 'UD1',
        category: 'UD',
        group: 2,
        type: AnswerOptionType.IMAGE
      },
      {
        id: uuidv4(),
        name: 'options.teachers.UD2',
        imgUrl: '/images/questionnaires/teachers/UD2.png',
        value: 'UD2',
        category: 'UD',
        group: 2,
        type: AnswerOptionType.IMAGE
      },
      {
        id: uuidv4(),
        name: 'options.teachers.UD3',
        imgUrl: '/images/questionnaires/teachers/UD3.png',
        value: 'UD3',
        category: 'UD',
        group: 2,
        type: AnswerOptionType.IMAGE
      },
      {
        id: uuidv4(),
        name: 'options.teachers.UD4',
        imgUrl: '/images/questionnaires/teachers/UD4.png',
        value: 'UD4',
        category: 'UD',
        group: 2,
        type: AnswerOptionType.IMAGE
      },
      {
        id: uuidv4(),
        name: 'options.teachers.UE1',
        imgUrl: '/images/questionnaires/teachers/UE1.png',
        value: 'UE1',
        category: 'UE',
        group: 2,
        type: AnswerOptionType.IMAGE
      },
      {
        id: uuidv4(),
        name: 'options.teachers.UE2',
        imgUrl: '/images/questionnaires/teachers/UE2.png',
        value: 'UE2',
        category: 'UE',
        group: 2,
        type: AnswerOptionType.IMAGE
      },
      {
        id: uuidv4(),
        name: 'options.teachers.UE3',
        imgUrl: '/images/questionnaires/teachers/UE3.png',
        value: 'UE3',
        category: 'UE',
        group: 2,
        type: AnswerOptionType.IMAGE
      },
      {
        id: uuidv4(),
        name: 'options.teachers.UE4',
        imgUrl: '/images/questionnaires/teachers/UE4.png',
        value: 'UE4',
        category: 'UE',
        group: 2,
        type: AnswerOptionType.IMAGE
      },
      {
        id: uuidv4(),
        name: 'options.teachers.UF1',
        imgUrl: '/images/questionnaires/teachers/UF1.png',
        value: 'UF1',
        category: 'UF',
        group: 2,
        type: AnswerOptionType.IMAGE
      },
      {
        id: uuidv4(),
        name: 'options.teachers.UF2',
        imgUrl: '/images/questionnaires/teachers/UF2.png',
        value: 'UF2',
        category: 'UF',
        group: 2,
        type: AnswerOptionType.IMAGE
      },
      {
        id: uuidv4(),
        name: 'options.teachers.UF3',
        imgUrl: '/images/questionnaires/teachers/UF3.png',
        value: 'UF3',
        category: 'UF',
        group: 2,
        type: AnswerOptionType.IMAGE
      },
      {
        id: uuidv4(),
        name: 'options.teachers.UF4',
        imgUrl: '/images/questionnaires/teachers/UF4.png',
        value: 'UF4',
        category: 'UF',
        group: 2,
        type: AnswerOptionType.IMAGE
      }
    ]
  });

  const teacherImagesOptions = await prisma.answerOption.findMany({
    where: {
      group: 2
    },
    select: {
      id: true
    }
  });

  const p1q1 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'pku.questions.1',
      order: 1,
      enableComment: true,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 3,
      answerOptions: {
        connect: teacherImagesOptions
      }
    }
  });

  const p1q2 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'pku.questions.2',
      order: 2,
      enableComment: true,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 3,
      answerOptions: {
        connect: teacherImagesOptions
      }
    }
  });

  const p1q3 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'pku.questions.3',
      order: 3,
      enableComment: true,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 3,
      answerOptions: {
        connect: teacherImagesOptions
      }
    }
  });

  const p1q4 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'pku.questions.4',
      order: 4,
      enableComment: true,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 3,
      answerOptions: {
        connect: teacherImagesOptions
      }
    }
  });

  await prisma.questionnairePart.create({
    data: {
      id: uuidv4(),
      name: 'pku.parts.1.name',
      description: 'pku.parts.1.desc',
      order: 1,
      questionnaireTypeId: typePku.id,
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
