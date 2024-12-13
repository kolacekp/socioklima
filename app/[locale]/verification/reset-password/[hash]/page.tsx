import { prisma } from '@/lib/prisma';
import { Suspense } from 'react';
import ResetPasswordUser from './resetPasswordUser';
import { getTranslations } from 'next-intl/server';
import ContentNotAllowed from '../../../dashboard/components/contentNotAllowed';
import moment from 'moment';
import InvalidToken from './invalidToken';
import DataLoading from '../../../dashboard/components/dataLoading';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'reset_password' });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

export default async function ResetPasswordPage({ params }: { params: { hash: string } }) {
  const user = await prisma.user.findFirst({
    where: { passwordResetToken: params.hash }
  });

  if (!user || !user.passwordResetToken || !user.passwordResetTokenValidTo) return <ContentNotAllowed />;

  const passwordResetTokenValid = user.passwordResetTokenValidTo >= moment().toDate();

  return (
    <Suspense fallback={<DataLoading />}>
      {passwordResetTokenValid && <ResetPasswordUser passwordResetToken={params.hash} />}
      {!passwordResetTokenValid && user.email && <InvalidToken email={user.email} />}
    </Suspense>
  );
}
