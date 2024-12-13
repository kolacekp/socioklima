import { prisma } from '@/lib/prisma';
import { UserData, UserInfo } from 'models/user-info';
import { Suspense } from 'react';
import VerificationUser from './verificationUser';
import { getTranslations } from 'next-intl/server';
import DataLoading from '../../../dashboard/components/dataLoading';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'verification' });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

async function getVerifiedUser(verificationToken: string): Promise<UserInfo> {
  const user = await prisma.user.findFirst({
    where: { verificationToken: verificationToken }
  });

  const isVerified = user?.verificationToken === verificationToken;

  if (isVerified && user?.id) {
    await updateVerificationDate(user.id);
  }

  const userInfo = new UserInfo(user as UserData);

  return JSON.parse(JSON.stringify(userInfo));
}

async function updateVerificationDate(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      verifiedAt: new Date(),
      updatedAt: new Date()
    }
  });
}

export default async function VerificationUserPage({ params }: { params: { hash: string } }) {
  const user = await getVerifiedUser(params.hash);

  return (
    <Suspense fallback={<DataLoading />}>
      <VerificationUser user={user} />
    </Suspense>
  );
}
