import dynamic from 'next/dynamic';
import { getTranslations } from 'next-intl/server';
import { useLocale } from 'next-intl';
import ChartJsImage from 'chartjs-to-image';
import 'chartjs-plugin-datalabels';
import { categoriesArray } from '@/utils/categories';
import { chartJSVersion, doughnutChartCommonOptions, solidChartCategoriesColorArray } from '@/utils/charts';
import { getSoklPupilCardResult } from '@/utils/reports/sokl/card/card';
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
  const t = await getTranslations({ locale, namespace: 'documents.questionnaires.sokl.pupil_card' });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

const PupilCard = dynamic(() => import('../pupilCard'), {
  ssr: false
});

export default async function PupilCardPDF({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { pupil: string };
}) {
  const tFindings = await getTranslations({ locale: useLocale(), namespace: 'documents.questionnaires.findings' });

  if (!params.id) return <Error403Page />;

  const session = await getServerSession(authOptions);
  if (!session) return <Error403Page />;
  const isAllowed = await isAllowedAccess([RolesEnum.ADMINISTRATOR, RolesEnum.EXPERT], session);
  if (!isAllowed) return <Error403Page />;

  const result = await getSoklPupilCardResult(params.id, searchParams.pupil);
  if (!result) return <NoResultsAlert />;

  const genderRequired = result.info.genderRequired;

  const doughnutChartTotal = await new ChartJsImage()
    .setConfig({
      type: 'doughnut',
      data: {
        labels: Object.entries(categoriesArray).map(([letter]) => `${letter}: ` + tFindings(`${letter}.name`)),
        datasets: [
          {
            data: result.results.charts.total,
            backgroundColor: solidChartCategoriesColorArray
          }
        ]
      },
      options: doughnutChartCommonOptions
    })
    .setChartJsVersion(chartJSVersion)
    .setWidth(800)
    .setHeight(400)
    .setDevicePixelRatio(2)
    .toDataUrl();

  const doughnutChartBoys = genderRequired
    ? await new ChartJsImage()
        .setConfig({
          type: 'doughnut',
          data: {
            labels: Object.entries(categoriesArray).map(([letter]) => `${letter}: ` + tFindings(`${letter}.name`)),
            datasets: [
              {
                data: result.results.charts.gender[1],
                backgroundColor: solidChartCategoriesColorArray
              }
            ]
          },
          options: doughnutChartCommonOptions
        })
        .setChartJsVersion(chartJSVersion)
        .setWidth(800)
        .setHeight(400)
        .setDevicePixelRatio(2)
        .toDataUrl()
    : '';

  const doughnutChartGirls = genderRequired
    ? await new ChartJsImage()
        .setConfig({
          type: 'doughnut',
          data: {
            labels: Object.entries(categoriesArray).map(([letter]) => `${letter}: ` + tFindings(`${letter}.name`)),
            datasets: [
              {
                data: result.results.charts.gender[2],
                backgroundColor: solidChartCategoriesColorArray
              }
            ]
          },
          options: doughnutChartCommonOptions
        })
        .setChartJsVersion(chartJSVersion)
        .setWidth(800)
        .setHeight(400)
        .setDevicePixelRatio(2)
        .toDataUrl()
    : '';

  return (
    <PupilCard
      genderRequired={genderRequired}
      doughnutChartTotal={doughnutChartTotal}
      doughnutChartBoys={doughnutChartBoys}
      doughnutChartGirls={doughnutChartGirls}
      result={result}
    />
  );
}
