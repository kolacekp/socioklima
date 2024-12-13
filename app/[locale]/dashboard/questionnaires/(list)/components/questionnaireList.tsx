'use client';

import { useConfirm } from '@/app/components/confirm/confirmProvider';
import { QuestionnaireListDto } from '@/models/questionnaires/questionnaireListDto';
import { Button, Table, Dropdown, Badge, Alert } from 'flowbite-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  HiOutlineTrash,
  HiOutlineDocumentChartBar,
  HiOutlineArchiveBoxArrowDown,
  HiOutlineUserGroup,
  HiOutlineNoSymbol
} from 'react-icons/hi2';

export default function QuestionnaireList({ questionnaireList }: { questionnaireList: QuestionnaireListDto[] }) {
  const [questionnaires, setQuestionnaires] = useState(questionnaireList);
  const t = useTranslations('dashboard.questionnaires.list');
  const tq = useTranslations('questionnaires');
  const { showConfirm } = useConfirm();
  const router = useRouter();

  const closeQuestionnaire = async (id: string) => {
    const res = await fetch(`/api/questionnaires/close`, {
      method: 'POST',
      body: JSON.stringify({
        id
      })
    });

    if (res.ok) {
      toast.success(t('closed'));
      const newQuestionnaires = questionnaires.map((questionnaire) => {
        if (questionnaire.id === id) {
          return {
            ...questionnaire,
            closedAt: new Date()
          };
        }
        return questionnaire;
      });
      setQuestionnaires(newQuestionnaires);
    } else {
      toast.error(t('close_failure'));
    }
  };

  const handleCloseQuestionnaire = (id: string) => {
    showConfirm({
      title: t('close_modal.title'),
      confirmMessage: t('close_modal.message'),
      onConfirm: () => closeQuestionnaire(id)
    });
  };

  const deleteQuestionnaire = async (id: string) => {
    const res = await fetch(`/api/questionnaires/delete`, {
      method: 'POST',
      body: JSON.stringify({
        id
      })
    });

    if (res.ok) {
      toast.success(t('deleted'));
      const newQuestionnaires = questionnaires.filter((questionnaire) => questionnaire.id !== id);
      setQuestionnaires(newQuestionnaires);
    } else {
      toast.error(t('delete_failure'));
    }
  };

  const handleDeleteQuestionnaire = (id: string) => {
    showConfirm({
      title: t('delete_modal.title'),
      confirmMessage: t('delete_modal.message'),
      onConfirm: () => deleteQuestionnaire(id)
    });
  };

  const nonArchived = questionnaires.filter((q) => !q.isArchived);
  const archived = questionnaires.filter((q) => q.isArchived);

  return (
    <>
      <div className="flex gap-2">
        <h1 className="text-xl mt-2 text-purple-600 grow font-bold dark:text-white">{t('heading')}</h1>
        <Button
          outline
          pill
          gradientDuoTone="purpleToBlue"
          onClick={() => {
            router.push('/dashboard/questionnaires/create');
          }}
        >
          {t('create')}
        </Button>
      </div>
      <div className="mt-2">
        {questionnaires.length == 0 && (
          <Alert icon={HiOutlineNoSymbol} color="purple">
            {t(`no_questionnaires`)}
          </Alert>
        )}
        {nonArchived.length > 0 && (
          <Table hoverable={true} className="mt-2" striped={true}>
            <Table.Head>
              <Table.HeadCell>{t('status.heading')}</Table.HeadCell>
              <Table.HeadCell>{t('type')}</Table.HeadCell>
              <Table.HeadCell>{t('class')}</Table.HeadCell>
              <Table.HeadCell>{t('created_at')}</Table.HeadCell>
              <Table.HeadCell>{t('closed_at')}</Table.HeadCell>
              <Table.HeadCell>{t('completed')}</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {nonArchived.map((questionnaire) => (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={questionnaire.id}>
                  <Table.Cell>
                    {questionnaire.closedAt ? (
                      <Badge className="w-fit" size="lg" color="purple">
                        {t('status.closed')}
                      </Badge>
                    ) : (
                      <Badge className="w-fit" size="lg" color="green">
                        {t('status.active')}
                      </Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell className="font-medium">
                    {tq(questionnaire.questionnaireType.name) +
                      ' (' +
                      tq(questionnaire.questionnaireType.shortName) +
                      ')'}
                  </Table.Cell>
                  <Table.Cell className="font-medium">{questionnaire.class.name}</Table.Cell>
                  <Table.Cell className="font-medium">{questionnaire.createdAt.toLocaleDateString('cs-CZ')}</Table.Cell>
                  <Table.Cell className="font-medium">{questionnaire.closedAt?.toLocaleDateString('cs-CZ')}</Table.Cell>
                  <Table.Cell className="font-medium">
                    {(questionnaire.completedCount || 0) + '/' + questionnaire.pupilCount}
                  </Table.Cell>
                  <Table.Cell className="float-right">
                    <Dropdown label={t('actions')} gradientDuoTone="purpleToBlue" outline pill>
                      <>
                        <Dropdown.Item
                          icon={HiOutlineDocumentChartBar}
                          className={
                            questionnaire.closedAt
                              ? 'text-green-500 disabled:hover:cursor-not-allowed disabled:text-gray-400'
                              : 'disabled:hover:cursor-not-allowed disabled:text-gray-400'
                          }
                          onClick={() => router.push(`/dashboard/questionnaires/reports/${questionnaire.id}`)}
                          disabled={questionnaire.completedCount < 1}
                        >
                          {questionnaire.closedAt ? t('results') : t('results_preview')}
                        </Dropdown.Item>
                        {!questionnaire.closedAt && (
                          <Dropdown.Item
                            icon={HiOutlineArchiveBoxArrowDown}
                            className="text-green-500"
                            onClick={() => handleCloseQuestionnaire(questionnaire.id)}
                          >
                            {t('close')}
                          </Dropdown.Item>
                        )}
                        <Dropdown.Divider />
                        <Dropdown.Item
                          icon={HiOutlineUserGroup}
                          onClick={() => router.push(`/dashboard/questionnaires/pupils/${questionnaire.id}`)}
                        >
                          {t('pupils')}
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item
                          icon={HiOutlineTrash}
                          className="text-red-500"
                          onClick={() => handleDeleteQuestionnaire(questionnaire.id)}
                        >
                          {t('delete')}
                        </Dropdown.Item>
                      </>
                    </Dropdown>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}

        {archived.length > 0 && (
          <>
            <h2 className="text-md mt-10 grow font-bold">{t('archive')}</h2>
            <div className="mt-4">
              <Table hoverable={true} className="mt-2" striped={true}>
                <Table.Head>
                  <Table.HeadCell>{t('status.heading')}</Table.HeadCell>
                  <Table.HeadCell>{t('type')}</Table.HeadCell>
                  <Table.HeadCell>{t('class')}</Table.HeadCell>
                  <Table.HeadCell>{t('created_at')}</Table.HeadCell>
                  <Table.HeadCell>{t('closed_at')}</Table.HeadCell>
                  <Table.HeadCell>{t('completed')}</Table.HeadCell>
                  <Table.HeadCell></Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {archived.map((questionnaire) => (
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={questionnaire.id}>
                      <Table.Cell>
                        {questionnaire.closedAt ? (
                          <Badge className="w-fit" size="lg" color="purple">
                            {t('status.closed')}
                          </Badge>
                        ) : (
                          <Badge className="w-fit" size="lg" color="green">
                            {t('status.active')}
                          </Badge>
                        )}
                      </Table.Cell>
                      <Table.Cell className="font-medium">
                        {tq(questionnaire.questionnaireType.name) +
                          ' (' +
                          tq(questionnaire.questionnaireType.shortName) +
                          ')'}
                      </Table.Cell>
                      <Table.Cell className="font-medium">{questionnaire.class.name}</Table.Cell>
                      <Table.Cell className="font-medium">
                        {questionnaire.createdAt.toLocaleDateString('cs-CZ')}
                      </Table.Cell>
                      <Table.Cell className="font-medium">
                        {questionnaire.closedAt?.toLocaleDateString('cs-CZ')}
                      </Table.Cell>
                      <Table.Cell className="font-medium">
                        {(questionnaire.completedCount || 0) + '/' + questionnaire.pupilCount}
                      </Table.Cell>
                      <Table.Cell className="float-right">
                        <Dropdown label={t('actions')} gradientDuoTone="purpleToBlue" outline pill>
                          <>
                            <Dropdown.Item
                              icon={HiOutlineDocumentChartBar}
                              className={
                                questionnaire.closedAt
                                  ? 'text-green-500 disabled:hover:cursor-not-allowed disabled:text-gray-400'
                                  : 'disabled:hover:cursor-not-allowed disabled:text-gray-400'
                              }
                              onClick={() => router.push(`/dashboard/questionnaires/reports/${questionnaire.id}`)}
                              disabled={questionnaire.completedCount < 1}
                            >
                              {questionnaire.closedAt ? t('results') : t('results_preview')}
                            </Dropdown.Item>
                            {!questionnaire.closedAt && (
                              <Dropdown.Item
                                icon={HiOutlineArchiveBoxArrowDown}
                                className="text-green-500"
                                onClick={() => handleCloseQuestionnaire(questionnaire.id)}
                              >
                                {t('close')}
                              </Dropdown.Item>
                            )}
                            <Dropdown.Divider />
                            <Dropdown.Item
                              icon={HiOutlineUserGroup}
                              onClick={() => router.push(`/dashboard/questionnaires/pupils/${questionnaire.id}`)}
                            >
                              {t('pupils')}
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              icon={HiOutlineTrash}
                              className="text-red-500"
                              onClick={() => handleDeleteQuestionnaire(questionnaire.id)}
                            >
                              {t('delete')}
                            </Dropdown.Item>
                          </>
                        </Dropdown>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
