import dynamic from 'next/dynamic';
import 'chartjs-plugin-datalabels';
import { getTranslations } from 'next-intl/server';
import Error403Page from 'app/[locale]/error/403/page';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { isAllowedAccess } from '@/services/session.service';
import { RolesEnum } from '@/models/roles/roles.enum';
import { getPkuCommentsResult } from '@/utils/reports/pku/comments/comments';
import NoResultsAlert from '../../../noResultsAlert';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'documents.questionnaires.pku.comments' });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

const CommentsTeacher = dynamic(() => import('../commentsTeacher'), {
  ssr: false
});

export default async function CommentsTeacherPDF({ params }: { params: { id: string } }) {
  if (!params.id) return <Error403Page />;

  const session = await getServerSession(authOptions);
  if (!session) return <Error403Page />;

  const isAllowed = await isAllowedAccess(
    [RolesEnum.ADMINISTRATOR, RolesEnum.EXPERT, RolesEnum.PRINCIPAL, RolesEnum.TEACHER, RolesEnum.SCHOOL_MANAGER],
    session
  );
  if (!isAllowed) return <Error403Page />;

  const result = await getPkuCommentsResult(params.id);
  if (!result) return <NoResultsAlert />;

  return <CommentsTeacher result={result} />;
}
