import dynamic from 'next/dynamic';
import { getTranslations } from 'next-intl/server';
import { useLocale } from 'next-intl';
import ChartJsImage from 'chartjs-to-image';
import 'chartjs-plugin-datalabels';
import { categoriesArray } from '@/utils/categories';
import {
  barChartCommonOptions,
  chartJSVersion,
  doughnutChartCommonOptions,
  solidChartCategoriesColorArray
} from '@/utils/charts';
import { getSoklBcdResult } from '@/utils/reports/sokl/bcd/bcd';
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
    namespace: 'documents.questionnaires.sokl.basic_class_diagnostic'
  });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

const BasicClassDiagnostic = dynamic(() => import('../basicClassDiagnostic'), {
  ssr: false
});

export default async function BasicClassDiagnosticPDF({ params }: { params: { id: string } }) {
  const t = await getTranslations({
    locale: useLocale(),
    namespace: 'documents.questionnaires.sokl.basic_class_diagnostic'
  });
  const tFindings = await getTranslations({ locale: useLocale(), namespace: 'documents.questionnaires.findings' });

  if (!params.id) return <Error403Page />;

  const session = await getServerSession(authOptions);
  if (!session) return <Error403Page />;
  const isAllowed = await isAllowedAccess(
    [RolesEnum.ADMINISTRATOR, RolesEnum.EXPERT, RolesEnum.PRINCIPAL, RolesEnum.TEACHER, RolesEnum.SCHOOL_MANAGER],
    session
  );
  if (!isAllowed) return <Error403Page />;

  const result = await getSoklBcdResult(params.id);
  if (!result) return <NoResultsAlert />;

  const doughnutChart = await new ChartJsImage()
    .setConfig({
      type: 'doughnut',
      data: {
        labels: Object.entries(categoriesArray).map(([letter]) => `${letter}: ` + tFindings(`${letter}.name`)),
        datasets: [
          {
            data: result.results.charts.doughnutChart,
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

  let values = result.results.charts.reviewObtainedChart;
  const reviewObtainedChart = await new ChartJsImage()
    .setConfig({
      type: 'bar',
      data: {
        labels: Object.keys(categoriesArray),
        datasets: [
          {
            label: t('pupils'),
            data: [
              values.A.total,
              values.B.total,
              values.C.total,
              values.D.total,
              values.E.total,
              values.F.total,
              values.G.total,
              values.H.total,
              values.I.total
            ],
            borderColor: 'green',
            backgroundColor: 'rgba(0 255 0 0.3)',
            borderWidth: 2
          },
          {
            label: t('boys'),
            data: [
              values.A.gender[1],
              values.B.gender[1],
              values.C.gender[1],
              values.D.gender[1],
              values.E.gender[1],
              values.F.gender[1],
              values.G.gender[1],
              values.H.gender[1],
              values.I.gender[1]
            ],
            borderColor: 'blue',
            backgroundColor: 'rgba(0 0 255 0.3)',
            borderWidth: 2
          },
          {
            label: t('girls'),
            data: [
              values.A.gender[2],
              values.B.gender[2],
              values.C.gender[2],
              values.D.gender[2],
              values.E.gender[2],
              values.F.gender[2],
              values.G.gender[2],
              values.H.gender[2],
              values.I.gender[2]
            ],
            borderColor: 'red',
            backgroundColor: 'rgba(255 0 0 0.3)',
            borderWidth: 2
          }
        ]
      },
      options: barChartCommonOptions
    })
    .setChartJsVersion(chartJSVersion)
    .setWidth(800)
    .setDevicePixelRatio(2)
    .toDataUrl();

  values = result.results.charts.reviewGivenChart;
  const reviewGivenChart = await new ChartJsImage()
    .setConfig({
      type: 'bar',
      data: {
        labels: Object.keys(categoriesArray),
        datasets: [
          {
            label: t('pupils'),
            data: [
              values.A.total,
              values.B.total,
              values.C.total,
              values.D.total,
              values.E.total,
              values.F.total,
              values.G.total,
              values.H.total,
              values.I.total
            ],
            borderColor: 'green',
            backgroundColor: 'rgba(0 255 0 0.3)',
            borderWidth: 2
          },
          {
            label: t('boys'),
            data: [
              values.A.gender[1],
              values.B.gender[1],
              values.C.gender[1],
              values.D.gender[1],
              values.E.gender[1],
              values.F.gender[1],
              values.G.gender[1],
              values.H.gender[1],
              values.I.gender[1]
            ],
            borderColor: 'blue',
            backgroundColor: 'rgba(0 0 255 0.3)',
            borderWidth: 2
          },
          {
            label: t('girls'),
            data: [
              values.A.gender[2],
              values.B.gender[2],
              values.C.gender[2],
              values.D.gender[2],
              values.E.gender[2],
              values.F.gender[2],
              values.G.gender[2],
              values.H.gender[2],
              values.I.gender[2]
            ],
            borderColor: 'red',
            backgroundColor: 'rgba(255 0 0 0.3)',
            borderWidth: 2
          }
        ]
      },
      options: barChartCommonOptions
    })
    .setChartJsVersion(chartJSVersion)
    .setWidth(800)
    .setDevicePixelRatio(2)
    .toDataUrl();

  values = result.results.charts.reviewMeToMyselfChart;
  const reviewMeToMyselfChart = await new ChartJsImage()
    .setConfig({
      type: 'bar',
      data: {
        labels: Object.keys(categoriesArray),
        datasets: [
          {
            label: t('total'),
            data: [
              values.A.total,
              values.B.total,
              values.C.total,
              values.D.total,
              values.E.total,
              values.F.total,
              values.G.total,
              values.H.total,
              values.I.total
            ],
            borderColor: 'green',
            backgroundColor: 'rgba(0 255 0 0.3)',
            borderWidth: 2
          },
          {
            label: t('boys'),
            data: [
              values.A.gender[1],
              values.B.gender[1],
              values.C.gender[1],
              values.D.gender[1],
              values.E.gender[1],
              values.F.gender[1],
              values.G.gender[1],
              values.H.gender[1],
              values.I.gender[1]
            ],
            borderColor: 'blue',
            backgroundColor: 'rgba(0 0 255 0.3)',
            borderWidth: 2
          },
          {
            label: t('girls'),
            data: [
              values.A.gender[2],
              values.B.gender[2],
              values.C.gender[2],
              values.D.gender[2],
              values.E.gender[2],
              values.F.gender[2],
              values.G.gender[2],
              values.H.gender[2],
              values.I.gender[2]
            ],
            borderColor: 'red',
            backgroundColor: 'rgba(255 0 0 0.3)',
            borderWidth: 2
          }
        ]
      },
      options: barChartCommonOptions
    })
    .setChartJsVersion(chartJSVersion)
    .setWidth(800)
    .setDevicePixelRatio(2)
    .toDataUrl();

  values = result.results.charts.reviewOthersToMyselfChart;
  const reviewOthersToMyselfChart = await new ChartJsImage()
    .setConfig({
      type: 'bar',
      data: {
        labels: Object.keys(categoriesArray),
        datasets: [
          {
            label: t('total'),
            data: [
              values.A.total,
              values.B.total,
              values.C.total,
              values.D.total,
              values.E.total,
              values.F.total,
              values.G.total,
              values.H.total,
              values.I.total
            ],
            borderColor: 'green',
            backgroundColor: 'rgba(0 255 0 0.3)',
            borderWidth: 2
          },
          {
            label: t('boys'),
            data: [
              values.A.gender[1],
              values.B.gender[1],
              values.C.gender[1],
              values.D.gender[1],
              values.E.gender[1],
              values.F.gender[1],
              values.G.gender[1],
              values.H.gender[1],
              values.I.gender[1]
            ],
            borderColor: 'blue',
            backgroundColor: 'rgba(0 0 255 0.3)',
            borderWidth: 2
          },
          {
            label: t('girls'),
            data: [
              values.A.gender[2],
              values.B.gender[2],
              values.C.gender[2],
              values.D.gender[2],
              values.E.gender[2],
              values.F.gender[2],
              values.G.gender[2],
              values.H.gender[2],
              values.I.gender[2]
            ],
            borderColor: 'red',
            backgroundColor: 'rgba(255 0 0 0.3)',
            borderWidth: 2
          }
        ]
      },
      options: barChartCommonOptions
    })
    .setChartJsVersion(chartJSVersion)
    .setWidth(800)
    .setDevicePixelRatio(2)
    .toDataUrl();

  values = result.results.charts.idealMeChart;
  const idealMeChart = await new ChartJsImage()
    .setConfig({
      type: 'bar',
      data: {
        labels: Object.keys(categoriesArray),
        datasets: [
          {
            label: t('total'),
            data: [
              values.A.total,
              values.B.total,
              values.C.total,
              values.D.total,
              values.E.total,
              values.F.total,
              values.G.total,
              values.H.total,
              values.I.total
            ],
            borderColor: 'green',
            backgroundColor: 'rgba(0 255 0 0.3)',
            borderWidth: 2
          },
          {
            label: t('boys'),
            data: [
              values.A.gender[1],
              values.B.gender[1],
              values.C.gender[1],
              values.D.gender[1],
              values.E.gender[1],
              values.F.gender[1],
              values.G.gender[1],
              values.H.gender[1],
              values.I.gender[1]
            ],
            borderColor: 'blue',
            backgroundColor: 'rgba(0 0 255 0.3)',
            borderWidth: 2
          },
          {
            label: t('girls'),
            data: [
              values.A.gender[2],
              values.B.gender[2],
              values.C.gender[2],
              values.D.gender[2],
              values.E.gender[2],
              values.F.gender[2],
              values.G.gender[2],
              values.H.gender[2],
              values.I.gender[2]
            ],
            borderColor: 'red',
            backgroundColor: 'rgba(255 0 0 0.3)',
            borderWidth: 2
          }
        ]
      },
      options: barChartCommonOptions
    })
    .setChartJsVersion(chartJSVersion)
    .setWidth(800)
    .setDevicePixelRatio(2)
    .toDataUrl();

  values = result.results.charts.rejectedMeChart;
  const rejectedMeChart = await new ChartJsImage()
    .setConfig({
      type: 'bar',
      data: {
        labels: Object.keys(categoriesArray),
        datasets: [
          {
            label: t('total'),
            data: [
              values.A.total,
              values.B.total,
              values.C.total,
              values.D.total,
              values.E.total,
              values.F.total,
              values.G.total,
              values.H.total,
              values.I.total
            ],
            borderColor: 'green',
            backgroundColor: 'rgba(0 255 0 0.3)',
            borderWidth: 2
          },
          {
            label: t('boys'),
            data: [
              values.A.gender[1],
              values.B.gender[1],
              values.C.gender[1],
              values.D.gender[1],
              values.E.gender[1],
              values.F.gender[1],
              values.G.gender[1],
              values.H.gender[1],
              values.I.gender[1]
            ],
            borderColor: 'blue',
            backgroundColor: 'rgba(0 0 255 0.3)',
            borderWidth: 2
          },
          {
            label: t('girls'),
            data: [
              values.A.gender[2],
              values.B.gender[2],
              values.C.gender[2],
              values.D.gender[2],
              values.E.gender[2],
              values.F.gender[2],
              values.G.gender[2],
              values.H.gender[2],
              values.I.gender[2]
            ],
            borderColor: 'red',
            backgroundColor: 'rgba(255 0 0 0.3)',
            borderWidth: 2
          }
        ]
      },
      options: barChartCommonOptions
    })
    .setChartJsVersion(chartJSVersion)
    .setWidth(800)
    .setDevicePixelRatio(2)
    .toDataUrl();

  values = result.results.charts.reviewMeToMyselfChart;
  const reviewMeToMyselfGNRChart = await new ChartJsImage()
    .setConfig({
      type: 'bar',
      data: {
        labels: Object.keys(categoriesArray),
        datasets: [
          {
            label: t('total'),
            data: [
              values.A.total,
              values.B.total,
              values.C.total,
              values.D.total,
              values.E.total,
              values.F.total,
              values.G.total,
              values.H.total,
              values.I.total
            ],
            borderColor: 'green',
            backgroundColor: 'rgba(0 255 0 0.3)',
            borderWidth: 2
          }
        ]
      },
      options: barChartCommonOptions
    })
    .setChartJsVersion(chartJSVersion)
    .setWidth(800)
    .setDevicePixelRatio(2)
    .toDataUrl();

  values = result.results.charts.reviewOthersToMyselfChart;
  const reviewOthersToMyselfGNRChart = await new ChartJsImage()
    .setConfig({
      type: 'bar',
      data: {
        labels: Object.keys(categoriesArray),
        datasets: [
          {
            label: t('total'),
            data: [
              values.A.total,
              values.B.total,
              values.C.total,
              values.D.total,
              values.E.total,
              values.F.total,
              values.G.total,
              values.H.total,
              values.I.total
            ],
            borderColor: 'green',
            backgroundColor: 'rgba(0 255 0 0.3)',
            borderWidth: 2
          }
        ]
      },
      options: barChartCommonOptions
    })
    .setChartJsVersion(chartJSVersion)
    .setWidth(800)
    .setDevicePixelRatio(2)
    .toDataUrl();

  values = result.results.charts.idealMeChart;
  const idealMeGNRChart = await new ChartJsImage()
    .setConfig({
      type: 'bar',
      data: {
        labels: Object.keys(categoriesArray),
        datasets: [
          {
            label: t('total'),
            data: [
              values.A.total,
              values.B.total,
              values.C.total,
              values.D.total,
              values.E.total,
              values.F.total,
              values.G.total,
              values.H.total,
              values.I.total
            ],
            borderColor: 'green',
            backgroundColor: 'rgba(0 255 0 0.3)',
            borderWidth: 2
          }
        ]
      },
      options: barChartCommonOptions
    })
    .setChartJsVersion(chartJSVersion)
    .setWidth(800)
    .setDevicePixelRatio(2)
    .toDataUrl();

  values = result.results.charts.rejectedMeChart;
  const rejectedMeGNRChart = await new ChartJsImage()
    .setConfig({
      type: 'bar',
      data: {
        labels: Object.keys(categoriesArray),
        datasets: [
          {
            label: t('total'),
            data: [
              values.A.total,
              values.B.total,
              values.C.total,
              values.D.total,
              values.E.total,
              values.F.total,
              values.G.total,
              values.H.total,
              values.I.total
            ],
            borderColor: 'green',
            backgroundColor: 'rgba(0 255 0 0.3)',
            borderWidth: 2
          }
        ]
      },
      options: barChartCommonOptions
    })
    .setChartJsVersion(chartJSVersion)
    .setWidth(800)
    .setDevicePixelRatio(2)
    .toDataUrl();

  return (
    <BasicClassDiagnostic
      doughnutChart={doughnutChart}
      reviewGivenChart={reviewGivenChart}
      reviewObtainedChart={reviewObtainedChart}
      reviewMeToMyselfChart={reviewMeToMyselfChart}
      reviewOthersToMyselfChart={reviewOthersToMyselfChart}
      idealMeChart={idealMeChart}
      rejectedMeChart={rejectedMeChart}
      reviewMeToMyselfGNRChart={reviewMeToMyselfGNRChart}
      reviewOthersToMyselfGNRChart={reviewOthersToMyselfGNRChart}
      idealMeGNRChart={idealMeGNRChart}
      rejectedMeGNRChart={rejectedMeGNRChart}
      info={result.info}
      tableResults={result.results.table}
    />
  );
}
