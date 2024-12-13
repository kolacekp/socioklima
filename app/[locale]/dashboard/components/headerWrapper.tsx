import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import Header from './header';
import { isAllowedAccess } from 'services/session.service';
import { RolesEnum } from 'models/roles/roles.enum';

export default async function HeaderWrapper() {
  const session = await getServerSession(authOptions);

  const showSchoolSelector = await isAllowedAccess([
    RolesEnum.ADMINISTRATOR,
    RolesEnum.SCHOOL_MANAGER,
    RolesEnum.EXPERT
  ]);

  return (
    <header className="sticky top-0 z-50 border-b dark:border-gray-700">
      <Header user={session?.user} showSchoolSelector={showSchoolSelector} />
    </header>
  );
}
