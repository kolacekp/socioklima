import { prisma } from '@/lib/prisma';
import ContentNotAllowed from '../../components/contentNotAllowed';
import { Suspense } from 'react';
import { isAllowedAccess } from '@/services/session.service';
import UserDetailForm from './components/userDetailForm';
import { RolesEnum } from '@/models/roles/roles.enum';
import DataLoading from '../../components/dataLoading';

export async function generateMetadata({
  params: { id }
}: {
  params: {
    id: string;
  };
}) {
  const user = await prisma.user.findFirst({
    where: {
      id: id
    },
    select: {
      name: true
    }
  });

  return {
    title: `SOCIOKLIMA | ${user?.name}`
  };
}

/*
async function getRoles() {
  return prisma.role.findMany();
}
*/

async function getUserDetail(userId: string) {
  return prisma.user.findFirstOrThrow({
    where: { id: userId },
    include: {
      roles: true
    }
  });
}

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  const allowedRoles = [RolesEnum.ADMINISTRATOR];

  if (!(await isAllowedAccess(allowedRoles))) {
    return <ContentNotAllowed />;
  }

  const user = await getUserDetail(params.id);

  return (
    <Suspense fallback={<DataLoading />}>
      <UserDetailForm user={user} />
    </Suspense>
  );
}
