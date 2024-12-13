'use client';

import { Table, Badge, Button } from 'flowbite-react';
import { useTranslations } from 'next-intl';
import { PupilResultListDto } from '../models/pupilResultListDto';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function QuestionnairePupilList({
  pupilResults,
  questionnaireId,
  typeName
}: {
  pupilResults: PupilResultListDto[];
  questionnaireId: string;
  typeName: string;
}) {
  const t = useTranslations('dashboard.questionnaires.pupils');
  const router = useRouter();

  const isSokl = typeName === 'sokl.name';
  const isUnvet = typeName === 'unvet.name';

  const showPupilCard = isSokl || isUnvet;

  return (
    <>
      <div
        className="text-gray-300 cursor-pointer hover:text-gray-400 text-sm w-fit"
        onClick={() => router.push('/dashboard/questionnaires')}
      >
        ← {t('back')}
      </div>
      <div className="flex gap-2 mb-4">
        <h1 className="text-xl mt-2 text-purple-600 grow font-bold dark:text-white">{t('heading')}</h1>
      </div>
      <Table hoverable={true} className="mt-2 mb-6" striped={true}>
        <Table.Head>
          <Table.HeadCell>{t('pupil')}</Table.HeadCell>
          <Table.HeadCell align="center">{t('status')}</Table.HeadCell>
          {showPupilCard && <Table.HeadCell align="center">{t('pupil_card')}</Table.HeadCell>}
        </Table.Head>
        <Table.Body className="divide-y">
          {pupilResults.length == 0 && (
            <Table.Row>
              <Table.Cell align="center" colSpan={4}>
                {t('no_results')}
              </Table.Cell>
            </Table.Row>
          )}
          {pupilResults.map((pupil) => (
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={pupil.id}>
              <Table.Cell>{pupil.user.name}</Table.Cell>
              <Table.Cell align="center">
                {pupil.questionnaireResults[0]?.isCompleted === false && (
                  <Badge className="w-fit" color="yellow">
                    {t('pending')}
                  </Badge>
                )}
                {pupil.questionnaireResults[0]?.isCompleted === true && (
                  <Badge className="w-fit" color="green">
                    {t('completed')}
                  </Badge>
                )}
                {pupil.questionnaireResults[0]?.isCompleted === null ||
                  (pupil.questionnaireResults[0]?.isCompleted === undefined && (
                    <Badge className="w-fit" color="red">
                      {t('not_completed')}
                    </Badge>
                  ))}
              </Table.Cell>
              {showPupilCard && (
                <Table.Cell align="center">
                  {pupil.questionnaireResults[0]?.isCompleted === true && (
                    <Link
                      href={`/documents/questionnaires/${
                        isSokl ? 'sokl' : 'unvet'
                      }/pupilCard/${questionnaireId}?pupil=${pupil.id}`}
                      target="_blank"
                    >
                      <Button outline pill gradientDuoTone={'purpleToBlue'}>
                        {t('pupil_card')}
                      </Button>
                    </Link>
                  )}
                </Table.Cell>
              )}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
}
