import { RolesEnum } from '@/models/roles/roles.enum';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { isAllowedAccess } from '@/services/session.service';
import { getUnvetSocialIndexResult } from '@/utils/reports/unvet/index';
import Error403Page from 'app/[locale]/error/403/page';
import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';
import NoResultsAlert from '../../../noResultsAlert';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({
    locale,
    namespace: 'documents.questionnaires.unvet.social_involvement_index'
  });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

const SocialInvolvementIndex = dynamic(() => import('../socialInvolvementIndex'), {
  ssr: false
});

export default async function SocialInvolvementIndexPDF({ params }: { params: { id: string } }) {
  if (!params.id) return <Error403Page />;

  const session = await getServerSession(authOptions);
  if (!session) return <Error403Page />;
  const isAllowed = await isAllowedAccess([RolesEnum.ADMINISTRATOR, RolesEnum.EXPERT], session);
  if (!isAllowed) return <Error403Page />;

  const result = await getUnvetSocialIndexResult(params.id);
  if (!result) return <NoResultsAlert />;

  return <SocialInvolvementIndex result={result} />;
}
