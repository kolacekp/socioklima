import dynamic from 'next/dynamic';
import ChartJsImage from 'chartjs-to-image';
import 'chartjs-plugin-datalabels';
import { teacherCategoriesArray } from '@/utils/categories';
import { chartJSVersion, doughnutChartCommonOptions, solidChartTeacherCategoriesColorArray } from '@/utils/charts';
import { getTranslations } from 'next-intl/server';
import { useLocale } from 'next-intl';
import { getPkuOpinionProfileResult } from '@/utils/reports/pku/profile/profile';
import Error403Page from 'app/[locale]/error/403/page';
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
    namespace: 'documents.questionnaires.pku.class_opinion_profile_teacher'
  });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

const ClassOpinionProfileTeacher = dynamic(() => import('../classOpinionProfileTeacher'), {
  ssr: false
});

export default async function ClassOpinionProfileTeacherPDF({ params }: { params: { id: string } }) {
  const tTeacherCategories = await getTranslations({
    locale: useLocale(),
    namespace: 'documents.questionnaires.teacher_categories'
  });
  if (!params.id) return <Error403Page />;

  const session = await getServerSession(authOptions);
  if (!session) return <Error403Page />;
  const isAllowed = await isAllowedAccess(
    [RolesEnum.ADMINISTRATOR, RolesEnum.EXPERT, RolesEnum.PRINCIPAL, RolesEnum.TEACHER, RolesEnum.SCHOOL_MANAGER],
    session
  );
  if (!isAllowed) return <Error403Page />;

  const result = await getPkuOpinionProfileResult(params.id);
  if (!result) return <NoResultsAlert />;

  const chart1 = await new ChartJsImage()
    .setConfig({
      type: 'doughnut',
      data: {
        labels: Object.entries(teacherCategoriesArray).map(
          ([letter]) => `${letter}: ` + tTeacherCategories(`${letter}.name`)
        ),
        datasets: [
          {
            data: result.results.questions[1].chart,
            backgroundColor: solidChartTeacherCategoriesColorArray
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
        labels: Object.entries(teacherCategoriesArray).map(
          ([letter]) => `${letter}: ` + tTeacherCategories(`${letter}.name`)
        ),
        datasets: [
          {
            data: result.results.questions[2].chart,
            backgroundColor: solidChartTeacherCategoriesColorArray
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
        labels: Object.entries(teacherCategoriesArray).map(
          ([letter]) => `${letter}: ` + tTeacherCategories(`${letter}.name`)
        ),
        datasets: [
          {
            data: result.results.questions[3].chart,
            backgroundColor: solidChartTeacherCategoriesColorArray
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
        labels: Object.entries(teacherCategoriesArray).map(
          ([letter]) => `${letter}: ` + tTeacherCategories(`${letter}.name`)
        ),
        datasets: [
          {
            data: result.results.questions[4].chart,
            backgroundColor: solidChartTeacherCategoriesColorArray
          }
        ]
      },
      options: doughnutChartCommonOptions
    })
    .setChartJsVersion(chartJSVersion)
    .setWidth(800)
    .setDevicePixelRatio(2)
    .toDataUrl();

  return <ClassOpinionProfileTeacher chart1={chart1} chart2={chart2} chart3={chart3} chart4={chart4} result={result} />;
}
