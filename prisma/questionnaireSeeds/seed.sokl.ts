import { AnswerOptionType } from '../../models/questionnaires/answerOptionTypes.enum';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
async function main() {
  const typeSokl = await prisma.questionnaireType.create({
    data: {
      id: uuidv4(),
      name: 'sokl.name',
      shortName: 'sokl.shortname',
      description: 'sokl.desc',
      linesOfDescription: 8
    }
  });

  await prisma.answerOption.createMany({
    data: [
      {
        id: uuidv4(),
        name: 'options.pupils.A1',
        imgUrl: '/images/questionnaires/pupils/A1.png',
        value: 'A1',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'A'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.A2',
        imgUrl: '/images/questionnaires/pupils/A2.png',
        value: 'A2',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'A'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.A3',
        imgUrl: '/images/questionnaires/pupils/A3.png',
        value: 'A3',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'A'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.B1',
        imgUrl: '/images/questionnaires/pupils/B1.png',
        value: 'B1',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'B'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.B2',
        imgUrl: '/images/questionnaires/pupils/B2.png',
        value: 'B2',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'B'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.B3',
        imgUrl: '/images/questionnaires/pupils/B3.png',
        value: 'B3',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'B'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.C1',
        imgUrl: '/images/questionnaires/pupils/C1.png',
        value: 'C1',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'C'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.C2',
        imgUrl: '/images/questionnaires/pupils/C2.png',
        value: 'C2',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'C'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.C3',
        imgUrl: '/images/questionnaires/pupils/C3.png',
        value: 'C3',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'C'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.D1',
        imgUrl: '/images/questionnaires/pupils/D1.png',
        value: 'D1',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'D'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.D2',
        imgUrl: '/images/questionnaires/pupils/D2.png',
        value: 'D2',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'D'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.D3',
        imgUrl: '/images/questionnaires/pupils/D3.png',
        value: 'D3',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'D'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.E1',
        imgUrl: '/images/questionnaires/pupils/E1.png',
        value: 'E1',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'E'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.E2',
        imgUrl: '/images/questionnaires/pupils/E2.png',
        value: 'E2',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'E'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.E3',
        imgUrl: '/images/questionnaires/pupils/E3.png',
        value: 'E3',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'E'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.F1',
        imgUrl: '/images/questionnaires/pupils/F1.png',
        value: 'F1',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'F'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.F2',
        imgUrl: '/images/questionnaires/pupils/F2.png',
        value: 'F2',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'F'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.F3',
        imgUrl: '/images/questionnaires/pupils/F3.png',
        value: 'F3',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'F'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.G1',
        imgUrl: '/images/questionnaires/pupils/G1.png',
        value: 'G1',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'G'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.G2',
        imgUrl: '/images/questionnaires/pupils/G2.png',
        value: 'G2',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'G'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.G3',
        imgUrl: '/images/questionnaires/pupils/G3.png',
        value: 'G3',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'G'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.H1',
        imgUrl: '/images/questionnaires/pupils/H1.png',
        value: 'H1',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'H'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.H2',
        imgUrl: '/images/questionnaires/pupils/H2.png',
        value: 'H2',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'H'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.H3',
        imgUrl: '/images/questionnaires/pupils/H3.png',
        value: 'H3',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'H'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.I1',
        imgUrl: '/images/questionnaires/pupils/I1.png',
        value: 'I1',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'I'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.I2',
        imgUrl: '/images/questionnaires/pupils/I2.png',
        value: 'I2',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'I'
      },
      {
        id: uuidv4(),
        name: 'options.pupils.I3',
        imgUrl: '/images/questionnaires/pupils/I3.png',
        value: 'I3',
        group: 1,
        type: AnswerOptionType.IMAGE,
        category: 'I'
      }
    ]
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
      name: 'sokl.questions.1',
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
      name: 'sokl.questions.2',
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
      name: 'sokl.questions.3',
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
      name: 'sokl.questions.4',
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
      name: 'sokl.parts.1.name',
      description: 'sokl.parts.1.desc',
      order: 1,
      questionnaireTypeId: typeSokl.id,
      questions: {
        connect: [p1q1, p1q2, p1q3, p1q4]
      }
    }
  });

  let allClassmatesOption = await prisma.answerOption.findFirst({
    where: {
      group: 0,
      type: AnswerOptionType.CLASSMATE
    }
  });

  if (!allClassmatesOption) {
    allClassmatesOption = await prisma.answerOption.create({
      data: {
        id: uuidv4(),
        name: 'Classmates',
        type: AnswerOptionType.CLASSMATE,
        group: 0,
        value: ''
      }
    });
  }

  const p2q1 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'sokl.questions.5',
      order: 1,
      enableComment: true,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 3,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q2 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'sokl.questions.6',
      order: 2,
      enableComment: true,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 3,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q3 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'sokl.questions.7',
      order: 3,
      enableComment: true,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 3,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  await prisma.questionnairePart.create({
    data: {
      id: uuidv4(),
      name: 'sokl.parts.2.name',
      description: 'sokl.parts.2.desc',
      order: 2,
      questionnaireTypeId: typeSokl.id,
      questions: {
        connect: [p2q1, p2q2, p2q3]
      }
    }
  });

  const p3q1 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'sokl.questions.8',
      order: 1,
      answerForAllClassmates: true,
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
      name: 'sokl.parts.3.name',
      description: 'sokl.parts.3.desc',
      order: 3,
      questionnaireTypeId: typeSokl.id,
      questions: {
        connect: [p3q1]
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
