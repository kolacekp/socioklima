'use client';

import { Report } from '@prisma/client';
import { Alert, Button, Card } from 'flowbite-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { HiOutlineClock, HiOutlineLockClosed } from 'react-icons/hi2';

export default function ReportItem({
  questionnaireId,
  report,
  product
}: {
  questionnaireId: string;
  report: Report;
  product: number;
}) {
  const t = useTranslations('dashboard.questionnaires.reports');

  return (
    <div>
      <Card className="h-full">
        <div className="text-center">
          <div className="text-lg font-bold">{t(report.name + '.name')}</div>
          <div className="text-gray-500 my-4">{t(report.name + '.desc')}</div>
          <div className="h-12 flex items-end justify-center">
            {report.isAvailable && product >= report.product && (
              <div>
                <Link href={report.link + questionnaireId} target="_blank">
                  <Button className="mx-auto" gradientDuoTone="purpleToBlue" outline pill>
                    {t('view')}
                  </Button>
                </Link>
              </div>
            )}
            {report.isAvailable && product < report.product && (
              <div className="block">
                <Alert icon={HiOutlineLockClosed} className="mx-auto" color="red">
                  {t('not_available')}
                </Alert>
              </div>
            )}
            {!report.isAvailable && (
              <div className="block">
                <Alert icon={HiOutlineClock} className="mx-auto" color="purple">
                  {t('soon_available')}
                </Alert>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
