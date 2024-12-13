import { prisma } from '@/lib/prisma';
import ContentNotAllowed from '../../../components/contentNotAllowed';
import { getUserRoles, isAllowedAccess } from 'services/session.service';
import { RolesEnum } from '@/models/roles/roles.enum';
import { SchoolDetailWithUsers } from '@/models/schools/schoolDetailWithUsers';
import SchoolDetailTabs from './components/schoolDetailTabs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function generateMetadata({
  params: { id }
}: {
  params: {
    id: string;
  };
}) {
  const school = await prisma.school.findFirst({
    where: {
      id: id
    },
    select: {
      schoolName: true
    }
  });
  return {
    title: `SOCIOKLIMA | ${school?.schoolName}`
  };
}

// TODO: Ověření že uživatel může zobrazit školu
async function getSchoolDetail(id: string) {
  return prisma.school.findFirstOrThrow({
    where: {
      id: id
    },
    include: {
      principal: {
        select: {
          user: true
        }
      },
      contactUser: true,
      experts: {
        include: {
          user: true
        }
      }
    }
  }) as Promise<SchoolDetailWithUsers>;
}

async function getSchoolLicenses(id: string) {
  return prisma.license.findMany({
    where: { schoolId: id }
  });
}

export default async function SchoolDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const allowedRoles = [RolesEnum.ADMINISTRATOR, RolesEnum.SCHOOL_MANAGER, RolesEnum.PRINCIPAL];
  const roles = await getUserRoles(session);

  if (!(await isAllowedAccess(allowedRoles))) {
    return <ContentNotAllowed />;
  }

  const school = await getSchoolDetail(params.id);
  const licenses = await getSchoolLicenses(school.id);

  return (
    <>
      <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-8 text-center text-xl font-bold dark:text-white">{school.schoolName}</h2>
        <SchoolDetailTabs schoolDetail={school} licenses={licenses} userRoles={roles} />
      </div>
    </>
  );
}
