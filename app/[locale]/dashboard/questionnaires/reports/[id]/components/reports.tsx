'use client';

import { Report } from '@prisma/client';
import ReportItem from './reportItem';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import AlertMessage from 'app/[locale]/dashboard/components/alertMessage';

export default function Reports({
  questionnaireId,
  reports,
  product,
  isClosed
}: {
  questionnaireId: string;
  reports: Report[];
  product: number;
  isClosed: boolean;
}) {
  const t = useTranslations('dashboard.questionnaires.reports');
  const router = useRouter();

  return (
    <>
      <div
        className="text-gray-300 cursor-pointer hover:text-gray-400 text-sm w-fit"
        onClick={() => router.push('/dashboard/questionnaires')}
      >
        ← {t('back')}
      </div>
      <h1 className="text-xl mt-2 text-purple-600 grow font-bold dark:text-white">{t('heading')}</h1>
      {reports.length === 0 && (
        <div className="mt-4">
          <AlertMessage color="failure" message={'no_reports'} />
        </div>
      )}
      {!isClosed && (
        <div className="mt-4">
          <AlertMessage message={'reports_preview'} />
        </div>
      )}
      <div className="grid mt-4 gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <ReportItem key={report.id} questionnaireId={questionnaireId} report={report} product={product} />
        ))}
      </div>
    </>
  );
}
