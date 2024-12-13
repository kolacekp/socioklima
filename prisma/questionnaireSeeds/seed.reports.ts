import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
async function main() {
  const soklTypes = await prisma.questionnaireType.findMany({
    where: {
      name: 'sokl.name'
    },
    select: {
      id: true
    }
  });

  soklTypes.forEach(async (sokl) => {
    await prisma.report.createMany({
      data: [
        {
          id: uuidv4(),
          name: 'sokl.bcd',
          product: 0,
          link: '/documents/questionnaires/sokl/basicClassDiagnostic/',
          isAvailable: true,
          questionnaireTypeId: sokl.id
        },
        {
          id: uuidv4(),
          name: 'sokl.dcd',
          product: 1,
          link: '/documents/questionnaires/sokl/detailClassDiagnostic/',
          isAvailable: true,
          questionnaireTypeId: sokl.id
        },
        {
          id: uuidv4(),
          name: 'sokl.dcde',
          product: 1,
          link: '/documents/questionnaires/sokl/detailClassDiagnosticExtract/',
          isAvailable: true,
          questionnaireTypeId: sokl.id
        },
        {
          id: uuidv4(),
          name: 'sokl.choices',
          product: 1,
          link: '/documents/questionnaires/sokl/choicesSummary/',
          isAvailable: true,
          questionnaireTypeId: sokl.id
        },
        {
          id: uuidv4(),
          name: 'sokl.card',
          product: 1,
          link: '/dashboard/questionnaires/pupils/',
          isAvailable: true,
          questionnaireTypeId: sokl.id
        },
        {
          id: uuidv4(),
          name: 'sokl.recommendations',
          product: 1,
          link: '/documents/questionnaires/sokl/recommendations/',
          isAvailable: true,
          questionnaireTypeId: sokl.id
        },
        {
          id: uuidv4(),
          name: 'sokl.index',
          product: 1,
          link: '/documents/questionnaires/sokl/socialInvolvementIndex/',
          isAvailable: true,
          questionnaireTypeId: sokl.id
        },
        {
          id: uuidv4(),
          name: 'sokl.sociogram',
          product: 1,
          link: '/documents/questionnaires/sokl/sociogram/',
          isAvailable: true,
          questionnaireTypeId: sokl.id
        }
      ]
    });
  });

  const unvetTypes = await prisma.questionnaireType.findMany({
    where: {
      name: 'unvet.name'
    },
    select: {
      id: true
    }
  });

  unvetTypes.forEach(async (unvet) => {
    await prisma.report.createMany({
      data: [
        {
          id: uuidv4(),
          name: 'unvet.bcd',
          product: 0,
          link: '/documents/questionnaires/unvet/basicClassDiagnostic/',
          isAvailable: true,
          questionnaireTypeId: unvet.id
        },
        {
          id: uuidv4(),
          name: 'unvet.dcd',
          product: 1,
          link: '/documents/questionnaires/unvet/detailClassDiagnostic/',
          isAvailable: true,
          questionnaireTypeId: unvet.id
        },
        {
          id: uuidv4(),
          name: 'unvet.dcde',
          product: 1,
          link: '/documents/questionnaires/unvet/detailClassDiagnosticExtract/',
          isAvailable: true,
          questionnaireTypeId: unvet.id
        },
        {
          id: uuidv4(),
          name: 'unvet.choices',
          product: 1,
          link: '/documents/questionnaires/unvet/choicesSummary/',
          isAvailable: true,
          questionnaireTypeId: unvet.id
        },
        {
          id: uuidv4(),
          name: 'unvet.card',
          product: 1,
          link: '/dashboard/questionnaires/pupils/',
          isAvailable: true,
          questionnaireTypeId: unvet.id
        },
        {
          id: uuidv4(),
          name: 'unvet.recommendations',
          product: 1,
          link: '/documents/questionnaires/unvet/recommendations/',
          isAvailable: true,
          questionnaireTypeId: unvet.id
        },
        {
          id: uuidv4(),
          name: 'unvet.index',
          product: 1,
          link: '/documents/questionnaires/unvet/socialInvolvementIndex/',
          isAvailable: true,
          questionnaireTypeId: unvet.id
        }
      ]
    });
  });

  const pkzTypes = await prisma.questionnaireType.findMany({
    where: {
      name: 'pkz.name'
    },
    select: {
      id: true
    }
  });

  pkzTypes.forEach(async (pkz) => {
    await prisma.report.createMany({
      data: [
        {
          id: uuidv4(),
          name: 'pkz.profile',
          product: 1,
          link: '/documents/questionnaires/pkz/classOpinionProfilePupil/',
          isAvailable: true,
          questionnaireTypeId: pkz.id
        },
        {
          id: uuidv4(),
          name: 'pkz.comments',
          product: 1,
          link: '/documents/questionnaires/pkz/comments/',
          isAvailable: true,
          questionnaireTypeId: pkz.id
        }
      ]
    });
  });

  const pkuTypes = await prisma.questionnaireType.findMany({
    where: {
      name: 'pku.name'
    },
    select: {
      id: true
    }
  });

  pkuTypes.forEach(async (pku) => {
    await prisma.report.createMany({
      data: [
        {
          id: uuidv4(),
          name: 'pku.profile',
          product: 1,
          link: '/documents/questionnaires/pku/classOpinionProfileTeacher/',
          isAvailable: true,
          questionnaireTypeId: pku.id
        },
        {
          id: uuidv4(),
          name: 'pku.comments',
          product: 1,
          link: '/documents/questionnaires/pku/comments/',
          isAvailable: true,
          questionnaireTypeId: pku.id
        }
      ]
    });
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
