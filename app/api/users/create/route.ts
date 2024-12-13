import { prisma } from '@/lib/prisma';
import { User } from '@prisma/client';
import moment from 'moment';
import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationLinkEmail } from 'services/nodemailer.service';
import { v4 as uuidv4 } from 'uuid';
import { RolesEnum } from '@/models/roles/roles.enum';
import { passwordHash } from '@/utils/passwords';

export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
  locale: string;
  verificationRequired?: boolean;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request?.json()) as UserCreateRequest;
  const isValid = body?.name && body?.email && body?.password;

  if (!isValid) {
    return NextResponse.json({ isCreated: false });
  }

  const userWithEmail = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: body.email
        },
        {
          username: body.email
        }
      ]
    }
  });

  if (userWithEmail) {
    return NextResponse.json({ isCreated: false }, { status: 409 });
  }

  return await handleCreateUser(body.name, body.email, body.password, body.locale, body.verificationRequired ?? false);
}

async function handleCreateUser(
  name: string,
  email: string,
  password: string,
  locale: string,
  verificationRequired: boolean
): Promise<NextResponse> {
  const user = await createUser(name, email, password, verificationRequired);

  if (user?.email && user?.verificationToken) {
    await sendVerificationLinkEmail(user.email, user.verificationToken, locale);

    return NextResponse.json({ isCreated: true });
  }

  return NextResponse.json({ isCreated: false });
}

async function createUser(name: string, email: string, password: string, verificationRequired: boolean): Promise<User> {
  const role = await prisma.role.findFirst({
    where: {
      slug: RolesEnum.SCHOOL_MANAGER
    }
  });

  let create = {
    email: email,
    name: name,
    password: await passwordHash(password),
    verificationRequired: verificationRequired,
    verificationToken: uuidv4(),
    verificationTokenValidTo: moment().add(7, 'days').toDate()
  };

  if (role?.id) {
    const roles = {
      roles: {
        connect: { id: role.id }
      }
    };

    create = { ...create, ...roles };
  }

  return prisma.user.create({
    data: create
  });
}
