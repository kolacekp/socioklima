import dynamic from 'next/dynamic';

import 'chartjs-plugin-datalabels';
import ChartJsImage from 'chartjs-to-image';
import { categoriesArray } from '@/utils/categories';
import { chartJSVersion, doughnutChartCommonOptions, solidChartCategoriesColorArray } from '@/utils/charts';
import { getTranslations } from 'next-intl/server';
import { useLocale } from 'next-intl';
import Error403Page from 'app/[locale]/error/403/page';
import { getPkzOpinionProfileResult } from '@/utils/reports/pkz/profile/profile';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { isAllowedAccess } from '@/services/session.service';
import { RolesEnum } from '@/models/roles/roles.enum';
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
    namespace: 'documents.questionnaires.pkz.class_opinion_profile_pupil'
  });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

const ClassOpinionProfilePupil = dynamic(() => import('../classOpinionProfilePupil'), {
  ssr: false
});

export default async function ClassOpinionProfilePupilPDF({ params }: { params: { id: string } }) {
  const tFindings = await getTranslations({ locale: useLocale(), namespace: 'documents.questionnaires.findings' });

  if (!params.id) return <Error403Page />;

  const session = await getServerSession(authOptions);
  if (!session) return <Error403Page />;
  const isAllowed = await isAllowedAccess(
    [RolesEnum.ADMINISTRATOR, RolesEnum.EXPERT, RolesEnum.PRINCIPAL, RolesEnum.TEACHER, RolesEnum.SCHOOL_MANAGER],
    session
  );
  if (!isAllowed) return <Error403Page />;

  const result = await getPkzOpinionProfileResult(params.id);
  if (!result) return <NoResultsAlert />;

  const chart1 = await new ChartJsImage()
    .setConfig({
      type: 'doughnut',
      data: {
        labels: Object.entries(categoriesArray).map(([letter]) => `${letter}: ` + tFindings(`${letter}.name`)),
        datasets: [
          {
            data: result.results.questions[1].chart,
            backgroundColor: solidChartCategoriesColorArray
          }
        ]
      },
      options: doughnutChartCommonOptions
    })
    .setChartJsVersion(chartJSVersion)
    .setWidth(800)
    .setDevicePixelRatio(2)
    .toDataUrl();

  const chart2 = await new ChartJsImage()
    .setConfig({
      type: 'doughnut',
      data: {
        labels: Object.entries(categoriesArray).map(([letter]) => `${letter}: ` + tFindings(`${letter}.name`)),
        datasets: [
          {
            data: result.results.questions[2].chart,
            backgroundColor: solidChartCategoriesColorArray
          }
        ]
      },
      options: doughnutChartCommonOptions
    })
    .setChartJsVersion(chartJSVersion)
    .setWidth(800)
    .setDevicePixelRatio(2)
    .toDataUrl();

  const chart3 = await new ChartJsImage()
    .setConfig({
      type: 'doughnut',
      data: {
        labels: Object.entries(categoriesArray).map(([letter]) => `${letter}: ` + tFindings(`${letter}.name`)),
        datasets: [
          {
            data: result.results.questions[3].chart,
            backgroundColor: solidChartCategoriesColorArray
          }
        ]
      },
      options: doughnutChartCommonOptions
    })
    .setChartJsVersion(chartJSVersion)
    .setWidth(800)
    .setDevicePixelRatio(2)
    .toDataUrl();

  const chart4 = await new ChartJsImage()
    .setConfig({
      type: 'doughnut',
      data: {
        labels: Object.entries(categoriesArray).map(([letter]) => `${letter}: ` + tFindings(`${letter}.name`)),
        datasets: [
          {
            data: result.results.questions[4].chart,
            backgroundColor: solidChartCategoriesColorArray
          }
        ]
      },
      options: doughnutChartCommonOptions
    })
    .setChartJsVersion(chartJSVersion)
    .setWidth(800)
    .setDevicePixelRatio(2)
    .toDataUrl();

  return <ClassOpinionProfilePupil chart1={chart1} chart2={chart2} chart3={chart3} chart4={chart4} result={result} />;
}
