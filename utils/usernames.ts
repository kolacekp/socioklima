import { prisma } from '@/lib/prisma';

interface NameParts {
  firstName: string;
  middleName?: string;
  lastName: string;
}

function splitFullName(fullName: string): NameParts {
  const parts = fullName.split(' ');
  const firstName = parts[0];
  const lastName = parts.pop() || '';
  const middleName = parts.slice(1).join(' ');

  return {
    firstName,
    middleName: middleName || undefined,
    lastName
  };
}

function removeNamePartsWithDots(name: string): string {
  return name
    .split(' ')
    .filter((namePart) => !namePart.includes('.'))
    .join(' ');
}

export async function generateUsername(name: string) {
  const parsedName = removeNamePartsWithDots(name);

  const nameParts = splitFullName(parsedName);
  const nameUsed = nameParts.lastName ?? nameParts.firstName;

  const shortName = nameUsed
    .slice(0, 5)
    .padEnd(5, 'x')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

  let usernameExists = false;
  let nameIndex = 0;
  let username = '';

  do {
    const nameIndexPrefix = nameIndex < 9 ? '0' : '';
    username = `x${shortName}${nameIndexPrefix}${nameIndex}`;

    const user = await prisma.user.findFirst({
      where: { username: username }
    });

    usernameExists = user != null;
    nameIndex++;
  } while (usernameExists);

  return username;
}
