import dynamic from 'next/dynamic';

import 'chartjs-plugin-datalabels';
import { getUnvetChoicesSummaryResult } from '@/utils/reports/unvet/choices/choices';
import Error403Page from 'app/[locale]/error/403/page';
import { getTranslations } from 'next-intl/server';
import { RolesEnum } from '@/models/roles/roles.enum';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { isAllowedAccess } from '@/services/session.service';
import { getServerSession } from 'next-auth';
import NoResultsAlert from '../../../noResultsAlert';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'documents.questionnaires.unvet.choices_summary' });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

const ChoicesSummary = dynamic(() => import('../choicesSummary'), {
  ssr: false
});

export default async function PupilCardPDF({ params }: { params: { id: string } }) {
  if (!params.id) return <Error403Page />;

  const session = await getServerSession(authOptions);
  if (!session) return <Error403Page />;
  const isAllowed = await isAllowedAccess([RolesEnum.ADMINISTRATOR, RolesEnum.EXPERT], session);
  if (!isAllowed) return <Error403Page />;

  const result = await getUnvetChoicesSummaryResult(params.id);
  if (!result) return <NoResultsAlert />;

  return <ChoicesSummary result={result} />;
}
