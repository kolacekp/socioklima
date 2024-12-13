import dynamic from 'next/dynamic';
import 'chartjs-plugin-datalabels';
import { getTranslations } from 'next-intl/server';
import Error403Page from 'app/[locale]/error/403/page';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { isAllowedAccess } from '@/services/session.service';
import { RolesEnum } from '@/models/roles/roles.enum';
import NoResultsAlert from '../../../noResultsAlert';
import { getPkzCommentsResult } from '@/utils/reports/pkz/comments/comments';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'documents.questionnaires.pkz.comments' });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

const CommentsPupil = dynamic(() => import('../commentsPupil'), {
  ssr: false
});

export default async function CommentsPupilPDF({ params }: { params: { id: string } }) {
  if (!params.id) return <Error403Page />;

  const session = await getServerSession(authOptions);
  if (!session) return <Error403Page />;

  const isAllowed = await isAllowedAccess(
    [RolesEnum.ADMINISTRATOR, RolesEnum.EXPERT, RolesEnum.PRINCIPAL, RolesEnum.TEACHER, RolesEnum.SCHOOL_MANAGER],
    session
  );
  if (!isAllowed) return <Error403Page />;

  const result = await getPkzCommentsResult(params.id);
  if (!result) return <NoResultsAlert />;

  return <CommentsPupil result={result} />;
}
