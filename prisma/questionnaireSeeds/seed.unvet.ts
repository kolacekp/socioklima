import { AnswerOptionType } from '../../models/questionnaires/answerOptionTypes.enum';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
async function main() {
  const typeUnvet = await prisma.questionnaireType.create({
    data: {
      id: uuidv4(),
      name: 'unvet.name',
      shortName: 'unvet.shortname',
      description: 'unvet.desc',
      linesOfDescription: 7
    }
  });

  await prisma.answerOption.createMany({
    data: [
      {
        id: uuidv4(),
        name: 'options.pupils.A1',
        value: 'A1',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'A',
        acceptance: 1,
        involvement: 1,
        safety: 1
      },
      {
        id: uuidv4(),
        name: 'options.pupils.A2',
        value: 'A2',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'A',
        acceptance: 1,
        involvement: 1,
        safety: 1
      },
      {
        id: uuidv4(),
        name: 'options.pupils.A3',
        value: 'A3',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'A',
        acceptance: 1,
        involvement: 1,
        safety: 1
      },
      {
        id: uuidv4(),
        name: 'options.pupils.B1',
        value: 'B1',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'B',
        acceptance: -1,
        involvement: -1,
        safety: -1
      },
      {
        id: uuidv4(),
        name: 'options.pupils.B2',
        value: 'B2',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'B',
        acceptance: -1,
        involvement: -1,
        safety: -1
      },
      {
        id: uuidv4(),
        name: 'options.pupils.B3',
        value: 'B3',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'B',
        acceptance: -1,
        involvement: -1,
        safety: -1
      },
      {
        id: uuidv4(),
        name: 'options.pupils.C1',
        value: 'C1',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'C',
        acceptance: 0,
        involvement: -1,
        safety: -1
      },
      {
        id: uuidv4(),
        name: 'options.pupils.C2',
        value: 'C2',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'C',
        acceptance: 1,
        involvement: 1,
        safety: 0
      },
      {
        id: uuidv4(),
        name: 'options.pupils.C3',
        value: 'C3',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'C',
        acceptance: 0,
        involvement: -1,
        safety: -1
      },
      {
        id: uuidv4(),
        name: 'options.pupils.D1',
        value: 'D1',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'D',
        acceptance: 1,
        involvement: 1,
        safety: 1
      },
      {
        id: uuidv4(),
        name: 'options.pupils.D2',
        value: 'D2',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'D',
        acceptance: -1,
        involvement: -1,
        safety: -1
      },
      {
        id: uuidv4(),
        name: 'options.pupils.D3',
        value: 'D3',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'D',
        acceptance: 0,
        involvement: 1,
        safety: 0
      },
      {
        id: uuidv4(),
        name: 'options.pupils.E1',
        value: 'E1',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'E',
        acceptance: -1,
        involvement: -1,
        safety: -1
      },
      {
        id: uuidv4(),
        name: 'options.pupils.E2',
        value: 'E2',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'E',
        acceptance: -1,
        involvement: -1,
        safety: -1
      },
      {
        id: uuidv4(),
        name: 'options.pupils.E3',
        value: 'E3',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'E',
        acceptance: -1,
        involvement: -1,
        safety: -1
      },
      {
        id: uuidv4(),
        name: 'options.pupils.F1',
        value: 'F1',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'F',
        acceptance: 0,
        involvement: 0,
        safety: 1
      },
      {
        id: uuidv4(),
        name: 'options.pupils.F2',
        value: 'F2',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'F',
        acceptance: 0,
        involvement: -1,
        safety: 0
      },
      {
        id: uuidv4(),
        name: 'options.pupils.F3',
        value: 'F3',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'F',
        acceptance: 0,
        involvement: 0,
        safety: 1
      },
      {
        id: uuidv4(),
        name: 'options.pupils.G1',
        value: 'G1',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'G',
        acceptance: 0,
        involvement: -1,
        safety: 0
      },
      {
        id: uuidv4(),
        name: 'options.pupils.G2',
        value: 'G2',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'G',
        acceptance: 0,
        involvement: -1,
        safety: 0
      },
      {
        id: uuidv4(),
        name: 'options.pupils.G3',
        value: 'G3',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'G',
        acceptance: 0,
        involvement: -1,
        safety: 0
      },
      {
        id: uuidv4(),
        name: 'options.pupils.H1',
        value: 'H1',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'H',
        acceptance: 0,
        involvement: 1,
        safety: 1
      },
      {
        id: uuidv4(),
        name: 'options.pupils.H2',
        value: 'H2',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'H',
        acceptance: 0,
        involvement: 1,
        safety: 1
      },
      {
        id: uuidv4(),
        name: 'options.pupils.H3',
        value: 'H3',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'H',
        acceptance: 0,
        involvement: 1,
        safety: 1
      },
      {
        id: uuidv4(),
        name: 'options.pupils.I1',
        value: 'I1',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'I',
        acceptance: 1,
        involvement: 1,
        safety: 11
      },
      {
        id: uuidv4(),
        name: 'options.pupils.I2',
        value: 'I2',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'I',
        acceptance: 1,
        involvement: 1,
        safety: 1
      },
      {
        id: uuidv4(),
        name: 'options.pupils.I3',
        value: 'I3',
        group: 3,
        type: AnswerOptionType.TEXT,
        category: 'I',
        acceptance: 1,
        involvement: 1,
        safety: 1
      }
    ]
  });

  const pupilTextOptions = await prisma.answerOption.findMany({
    where: {
      group: 3
    },
    select: {
      id: true
    }
  });

  const p1q1 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.1',
      order: 1,
      enableComment: true,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 3,
      answerOptions: {
        connect: pupilTextOptions
      }
    }
  });

  const p1q2 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.2',
      order: 2,
      enableComment: true,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 3,
      answerOptions: {
        connect: pupilTextOptions
      }
    }
  });

  const p1q3 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.3',
      order: 3,
      enableComment: true,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 3,
      answerOptions: {
        connect: pupilTextOptions
      }
    }
  });

  const p1q4 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.4',
      order: 4,
      enableComment: true,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 3,
      answerOptions: {
        connect: pupilTextOptions
      }
    }
  });

  await prisma.questionnairePart.create({
    data: {
      id: uuidv4(),
      name: 'unvet.parts.1.name',
      description: 'unvet.parts.1.desc',
      order: 1,
      questionnaireTypeId: typeUnvet.id,
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
      name: 'unvet.questions.5',
      order: 1,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q2 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.6',
      order: 2,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q3 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.7',
      order: 3,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q4 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.8',
      order: 4,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q5 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.9',
      order: 5,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q6 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.10',
      order: 6,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q7 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.11',
      order: 7,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q8 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.12',
      order: 8,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q9 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.13',
      order: 9,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q10 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.14',
      order: 10,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q11 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.15',
      order: 11,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q12 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.16',
      order: 12,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q13 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.17',
      order: 13,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q14 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.18',
      order: 14,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q15 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.19',
      order: 15,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q16 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.20',
      order: 16,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q17 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.21',
      order: 17,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q18 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.22',
      order: 18,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q19 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.23',
      order: 19,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q20 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.24',
      order: 20,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q21 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.25',
      order: 21,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q22 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.26',
      order: 22,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q23 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.27',
      order: 23,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q24 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.28',
      order: 24,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q25 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.29',
      order: 25,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q26 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.30',
      order: 26,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  const p2q27 = await prisma.question.create({
    data: {
      id: uuidv4(),
      name: 'unvet.questions.31',
      order: 27,
      enableComment: false,
      hasAnswerOptions: true,
      selectOptionsMin: 1,
      selectOptionsMax: 5,
      answerOptions: {
        connect: allClassmatesOption
      }
    }
  });

  await prisma.questionnairePart.create({
    data: {
      id: uuidv4(),
      name: 'unvet.parts.2.name',
      description: 'unvet.parts.2.desc',
      order: 2,
      questionnaireTypeId: typeUnvet.id,
      questions: {
        connect: [
          p2q1,
          p2q2,
          p2q3,
          p2q4,
          p2q5,
          p2q6,
          p2q7,
          p2q8,
          p2q9,
          p2q10,
          p2q11,
          p2q12,
          p2q13,
          p2q14,
          p2q15,
          p2q16,
          p2q17,
          p2q18,
          p2q19,
          p2q20,
          p2q21,
          p2q22,
          p2q23,
          p2q24,
          p2q25,
          p2q26,
          p2q27
        ]
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
