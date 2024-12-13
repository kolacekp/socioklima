import dynamic from 'next/dynamic';
import ChartJsImage from 'chartjs-to-image';
import 'chartjs-plugin-datalabels';
import { categoriesArray } from '@/utils/categories';
import { barChartCommonOptions, chartJSVersion } from '@/utils/charts';
import { getTranslations } from 'next-intl/server';
import { useLocale } from 'next-intl';
import { getUnvetDcdResult } from '@/utils/reports/unvet/dcd/dcd';
import { RolesEnum } from '@/models/roles/roles.enum';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { isAllowedAccess } from '@/services/session.service';
import Error403Page from 'app/[locale]/error/403/page';
import { getServerSession } from 'next-auth';
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
    namespace: 'documents.questionnaires.unvet.detail_class_diagnostic'
  });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

const DetailClassDiagnostic = dynamic(() => import('../detailClassDiagnostic'), {
  ssr: false
});

export default async function DetailClassDiagnosticPDF({ params }: { params: { id: string } }) {
  const t = await getTranslations({
    locale: useLocale(),
    namespace: 'documents.questionnaires.unvet.basic_class_diagnostic'
  });

  if (!params.id) return <Error403Page />;

  const session = await getServerSession(authOptions);
  if (!session) return <Error403Page />;
  const isAllowed = await isAllowedAccess([RolesEnum.ADMINISTRATOR, RolesEnum.EXPERT], session);
  if (!isAllowed) return <Error403Page />;

  const result = await getUnvetDcdResult(params.id);
  if (!result) return <NoResultsAlert />;

  const barChart = await new ChartJsImage()
    .setConfig({
      type: 'bar',
      data: {
        labels: Object.entries(categoriesArray).map(([letter]) => letter),
        datasets: [
          {
            label: t('class_pupil_count'),
            data: result.results.charts.barChart.total,
            borderColor: 'blue',
            backgroundColor: 'rgba(0 0 255 0.3)',
            borderWidth: 2
          },
          {
            label: t('choices_count'),
            data: result.results.charts.barChart.given,
            borderColor: 'green',
            backgroundColor: 'rgba(0 255 0 0.3)',
            borderWidth: 2
          },
          {
            label: t('nominated_pupil_count'),
            data: result.results.charts.barChart.received,
            borderColor: 'yellow',
            backgroundColor: 'rgba(255 255 0 0.3)',
            borderWidth: 2
          }
        ]
      },
      options: barChartCommonOptions
    })
    .setChartJsVersion(chartJSVersion)
    .setWidth(800)
    .setHeight(400)
    .setDevicePixelRatio(2)
    .toDataUrl();

  return <DetailClassDiagnostic barChart={barChart} result={result} />;
}
