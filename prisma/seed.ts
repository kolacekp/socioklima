import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { RolesEnum } from '../models/roles/roles.enum';
import { passwordHash } from '../utils/passwords';

const prisma = new PrismaClient();
async function main() {
  // 1. roles
  await prisma.role.deleteMany();

  const administratorRole = await prisma.role.create({
    data: {
      id: uuidv4(),
      slug: RolesEnum.ADMINISTRATOR
    }
  });

  // rest of roles
  await prisma.role.createMany({
    data: [
      { id: uuidv4(), slug: RolesEnum.PUPIL },
      { id: uuidv4(), slug: RolesEnum.PRINCIPAL },
      { id: uuidv4(), slug: RolesEnum.TEACHER },
      { id: uuidv4(), slug: RolesEnum.EXPERT },
      { id: uuidv4(), slug: RolesEnum.SCHOOL_MANAGER }
    ]
  });

  const existingAdmin = await prisma.user.findFirst({
    where: {
      email: 'info@socioklima.eu'
    }
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: 'info@socioklima.eu',
        name: 'Milena Mikulková',
        password: await passwordHash('Socioklima2023!'),
        verifiedAt: new Date(),
        roles: {
          connect: { id: administratorRole.id }
        }
      }
    });
  }
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
