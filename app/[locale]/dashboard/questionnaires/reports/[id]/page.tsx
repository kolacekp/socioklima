import { prisma } from '@/lib/prisma';
import Reports from './components/reports';
import { RolesEnum } from '@/models/roles/roles.enum';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { isAllowedAccess } from '@/services/session.service';
import Error403Page from 'app/[locale]/error/403/page';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params: { locale }
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'dashboard.questionnaires.reports' });

  return {
    title: `SOCIOKLIMA | ${t('heading')}`
  };
}

export default async function ReportsPage({ params }: { params: { id: string } }) {
  if (!params.id) return <Error403Page />;

  const allowedRoles = [
    RolesEnum.ADMINISTRATOR,
    RolesEnum.SCHOOL_MANAGER,
    RolesEnum.EXPERT,
    RolesEnum.TEACHER,
    RolesEnum.PRINCIPAL
  ];
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return <Error403Page />;
  }

  const isAllowed = await isAllowedAccess(allowedRoles, session);
  if (!isAllowed) return <Error403Page />;

  const questionnaire = await prisma.questionnaire.findUnique({
    where: {
      id: params.id
    },
    include: {
      questionnaireType: {
        include: {
          reports: {
            where: {
              deletedAt: null
            }
          }
        }
      },
      class: {
        include: {
          license: {
            select: {
              product: true
            }
          }
        }
      }
    }
  });
  if (!questionnaire) return null;

  let reports = questionnaire.questionnaireType.reports;
  const product = questionnaire.class.license.product;

  const showDetailReports = await isAllowedAccess([RolesEnum.ADMINISTRATOR, RolesEnum.EXPERT], session);

  // Pouze neadresné výstupy
  if (!showDetailReports) {
    reports = reports.filter((report) => report.product === 0);
  }

  return (
    <Reports
      questionnaireId={params.id}
      reports={reports}
      product={product}
      isClosed={questionnaire.closedAt !== null}
    />
  );
}
