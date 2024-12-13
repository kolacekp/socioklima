import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Role } from '@prisma/client';
import { RolesEnum } from 'models/roles/roles.enum';
import { Session, getServerSession } from 'next-auth';
import { getEnumKeyByEnumValue } from 'utils/enums';

export async function isAllowedAccess(allowedRoles: RolesEnum[], session?: Session): Promise<boolean> {
  const userRoles = await getUserRoles(session || null);

  return (
    userRoles.filter((role: string) => {
      const key = getEnumKeyByEnumValue(RolesEnum, role);
      if (!key) return false;
      return allowedRoles.includes(RolesEnum[key]);
    }).length > 0
  );
}

export async function isUserOnlyUnverifiedExpert(session?: Session): Promise<boolean> {
  const userRoles = await getUserRoles(session || null);
  return !!(
    userRoles.length == 1 &&
    userRoles[0] == RolesEnum.EXPERT &&
    session?.user.expert &&
    !session.user.expert.isVerified
  );
}

export async function setImpersonation(id: string, email: string) {
  const session = await getServerSession(authOptions);
  if (session) session.user.impersonated = { id: id, email: email };
}

export async function resetImpersonation() {
  const session = await getServerSession(authOptions);
  if (session) session.user.impersonated = undefined;
}

export async function isUserAdmin(session?: Session): Promise<boolean> {
  const userRoles = await getUserRoles(session || null);
  let isAdmin = false;

  userRoles.map((role: string) => {
    if (role == RolesEnum.ADMINISTRATOR) {
      isAdmin = true;
    }
  });

  return isAdmin;
}

export async function getUserRoles(session: Session | null): Promise<string[]> {
  if (!session) {
    session = await getServerSession(authOptions);
  }

  const roles = session?.user?.roles ?? ([] as Role[]);

  return roles.map((role: Role) => {
    return role.slug;
  });
}

export async function getSessionUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return null;
  }

  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email
    },
    select: {
      id: true
    }
  });
  return user?.id ?? null;
}
