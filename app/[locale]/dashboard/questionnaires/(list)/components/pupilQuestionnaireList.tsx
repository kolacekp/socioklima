'use client';

import { PupilQuestionnaireListDto } from '@/models/questionnaires/pupilQuestionnaireListDto';
import { Table, Badge, Button } from 'flowbite-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PupilQuestionnaireList({
  questionnaireList
}: {
  questionnaireList: PupilQuestionnaireListDto[];
}) {
  const [questionnaires] = useState(questionnaireList);
  const t = useTranslations('dashboard.questionnaires.list');
  const tq = useTranslations('questionnaires');
  const router = useRouter();

  return (
    <>
      <div className="flex gap-2 mb-4">
        <h1 className="text-xl mt-2 text-purple-600 grow font-bold dark:text-white">{t('heading')}</h1>
      </div>
      <Table hoverable={true} className="mt-2 mb-6" striped={true}>
        <Table.Head>
          <Table.HeadCell>{t('status.heading')}</Table.HeadCell>
          <Table.HeadCell>{t('name')}</Table.HeadCell>
          <Table.HeadCell>{t('created_at')}</Table.HeadCell>
          <Table.HeadCell>{t('status.heading_completion')}</Table.HeadCell>
          <Table.HeadCell align="center"></Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {questionnaires.length == 0 && (
            <Table.Row>
              <Table.Cell align="center" colSpan={4}>
                {t('no_questionnaires')}
              </Table.Cell>
            </Table.Row>
          )}
          {questionnaires.map((questionnaire) => (
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={questionnaire.id}>
              <Table.Cell>
                {questionnaire.closedAt ? (
                  <Badge className="w-fit" color="purple">
                    {t('status.closed')}
                  </Badge>
                ) : (
                  <Badge className="w-fit" color="green">
                    {t('status.active')}
                  </Badge>
                )}
              </Table.Cell>
              <Table.Cell>{tq(questionnaire.questionnaireType.name)}</Table.Cell>
              <Table.Cell>{questionnaire.createdAt.toLocaleDateString('cs-CZ')}</Table.Cell>

              <Table.Cell>
                {(questionnaire.questionnaireResults[0]?.isCompleted === undefined ||
                  questionnaire.questionnaireResults[0].isCompleted === null) && (
                  <Badge className="w-fit" color="red">
                    {t('status.not_completed')}
                  </Badge>
                )}
                {questionnaire.questionnaireResults[0]?.isCompleted === true && (
                  <Badge className="w-fit" color="green">
                    {t('status.completed')}
                  </Badge>
                )}
                {questionnaire.questionnaireResults[0]?.isCompleted === false && (
                  <Badge className="w-fit" color="yellow">
                    {t('status.pending')}
                  </Badge>
                )}
              </Table.Cell>
              <Table.Cell align="center">
                {!questionnaire.questionnaireResults[0]?.isCompleted && !questionnaire.closedAt && (
                  <Button
                    outline
                    pill
                    gradientDuoTone="purpleToBlue"
                    onClick={() => router.push(`/questionnaire/${questionnaire.id}`)}
                  >
                    {t('start')}
                  </Button>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
}
