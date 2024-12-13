import dynamic from 'next/dynamic';
import { getTranslations } from 'next-intl/server';
import { useLocale } from 'next-intl';
import { categoriesArray } from '@/utils/categories';
import { chartJSVersion, doughnutChartCommonOptions, solidChartCategoriesColorArray } from '@/utils/charts';
import ChartJsImage from 'chartjs-to-image';
import 'chartjs-plugin-datalabels';
import { getSoklDcdResult } from '@/utils/reports/sokl/dcd/dcd';
import { getServerSession } from 'next-auth';
import { RolesEnum } from '@/models/roles/roles.enum';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { isAllowedAccess } from '@/services/session.service';
import Error403Page from 'app/[locale]/error/403/page';
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
    namespace: 'documents.questionnaires.sokl.detail_class_diagnostic'
  });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

const DetailClassDiagnostic = dynamic(() => import('../detailClassDiagnostic'), {
  ssr: false
});

export interface DoughnutCharts {
  [key: string]: string;
}

export default async function DetailClassDiagnosticPDF({ params }: { params: { id: string } }) {
  const tFindings = await getTranslations({ locale: useLocale(), namespace: 'documents.questionnaires.findings' });

  if (!params.id) return <Error403Page />;

  const session = await getServerSession(authOptions);
  if (!session) return <Error403Page />;
  const isAllowed = await isAllowedAccess([RolesEnum.ADMINISTRATOR, RolesEnum.EXPERT], session);
  if (!isAllowed) return <Error403Page />;

  const result = await getSoklDcdResult(params.id);
  if (!result) return <NoResultsAlert />;

  const doughnutCharts: DoughnutCharts = { main: '' };

  const categoriesKeysArray = Object.keys(categoriesArray);
  categoriesKeysArray.map((key) => {
    doughnutCharts[key] = '';
  });

  const initialBorderColors = Array.from({ length: categoriesKeysArray.length }, () => 'white');

  const initialBorderWidths = Array.from({ length: categoriesKeysArray.length }, () => 2);

  const basicDoughnutChartConfig = {
    type: 'doughnut',
    data: {
      labels: Object.entries(categoriesArray).map(([letter]) => `${letter}: ` + tFindings(`${letter}.name`)),
      datasets: [
        {
          data: result.results.charts.doughnutChart,
          backgroundColor: solidChartCategoriesColorArray,
          borderColor: initialBorderColors,
          borderWidth: initialBorderWidths,
          borderAlign: 'inner'
        }
      ]
    },
    options: doughnutChartCommonOptions
  };

  const doughnutChart = new ChartJsImage();

  // main chart
  doughnutCharts.main = await doughnutChart
    .setConfig(basicDoughnutChartConfig)
    .setChartJsVersion(chartJSVersion)
    .setWidth(800)
    .setHeight(400)
    .setDevicePixelRatio(2)
    .toDataUrl();

  // categories charts
  for (let i = 0; i < categoriesKeysArray.length; i++) {
    const borderColors = [...initialBorderColors];
    borderColors[i] = 'black';
    const doughnutChartConfig = { ...basicDoughnutChartConfig };
    doughnutChartConfig.data.datasets[0].borderColor = borderColors;
    doughnutChart.setConfig(doughnutChartConfig);
    doughnutCharts[Object.keys(doughnutCharts)[i + 1]] = await doughnutChart.toDataUrl();
  }

  return <DetailClassDiagnostic doughnutCharts={doughnutCharts} result={result} />;
}
