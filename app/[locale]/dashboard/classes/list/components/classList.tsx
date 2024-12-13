'use client';

import { Alert, Badge, Button, Dropdown, Table } from 'flowbite-react';
import { ClassListDto } from 'models/classes/classList.dto';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
  HiOutlineArchiveBoxArrowDown,
  HiOutlineKey,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineUserGroup,
  HiArrowUpTray,
  HiOutlineNoSymbol,
  HiOutlineInformationCircle
} from 'react-icons/hi2';
import UpgradeClassModal, { UpgradeClassFormValues } from './upgradeClassModal';
import toast from 'react-hot-toast';
import { useConfirm } from '@/app/components/confirm/confirmProvider';
import { useRouter } from 'next/navigation';
import EditClassModal, { EditClassFormValues } from './editClassModal';

export default function ClassList({
  classList,
  isAdminOrManager
}: {
  classList: ClassListDto[];
  isAdminOrManager: boolean;
}) {
  const t = useTranslations('dashboard.classes.list');
  const tLists = useTranslations('lists');

  const [classes, setClasses] = useState(classList);
  const [selectedClass, setSelectedClass] = useState<ClassListDto | null>(null);
  const [openUpgradeModal, setOpenUpgradeModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const { showConfirm } = useConfirm();
  const router = useRouter();

  const openUpgradeClassModal = (selectedClass: ClassListDto) => {
    setSelectedClass(selectedClass);
    setOpenUpgradeModal(true);
  };

  const openEditClassModal = (selectedClass: ClassListDto) => {
    setSelectedClass(selectedClass);
    setOpenEditModal(true);
  };

  const handleDeleteClassClick = async (id: string) => {
    showConfirm({
      title: t('confirm_delete_title'),
      confirmMessage: t('confirm_delete_message'),
      async onConfirm() {
        const res = await fetch('/api/classes/delete', {
          method: 'POST',
          body: JSON.stringify({ id }),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (res.ok) {
          toast.success(t('delete_success'));
          setClasses((cls) => cls.filter((c) => c.id !== id));
        } else {
          toast.error(t('delete_failure'));
        }
      }
    });
  };

  const handleArchiveClassClick = async (id: string) => {
    showConfirm({
      title: t('confirm_archive_title'),
      confirmMessage: t('confirm_archive_message'),
      async onConfirm() {
        const res = await fetch('/api/classes/archive', {
          method: 'POST',
          body: JSON.stringify({ id }),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (res.ok) {
          toast.success(t('archive_success'));
          setClasses((cls) =>
            cls.map((c) => {
              if (c.id == id) {
                return { ...c, isArchived: true };
              }
              return c;
            })
          );
        } else {
          toast.error(t('archive_failure'));
        }
      }
    });
  };

  const updateClass = async (values: UpgradeClassFormValues | EditClassFormValues) => {
    const res = await fetch('/api/classes/upgrade', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (res.ok) {
      setOpenUpgradeModal(false);
      setOpenEditModal(false);
      const data = await res.json();
      const newClass = data.class as ClassListDto;
      newClass.license.validFrom = new Date(newClass.license.validFrom);
      newClass.license.validUntil = new Date(newClass.license.validUntil);
      newClass.isArchived = false;
      setClasses((prev) =>
        prev.map((cls) => {
          if (cls.id == newClass.id) return { ...cls, ...newClass };
          return cls;
        })
      );
      toast.success(t('update_success'));
    }
  };

  const isLicenseValid = (license: ClassListDto['license']) => {
    return license.validUntil > new Date() && !license.deletedAt && license.isPaid;
  };

  const nonArchived = classes.filter((c) => !c.isArchived);
  const archived = classes.filter((c) => c.isArchived);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <h1 className="text-xl mt-2 text-purple-600 grow font-bold dark:text-white">{t('heading')}</h1>
        <Button outline pill gradientDuoTone="purpleToBlue" onClick={() => router.push('/dashboard/classes/create')}>
          {t('add_class')}
        </Button>
      </div>
      <div className="mt-2">
        {classes.length == 0 && (
          <Alert icon={HiOutlineNoSymbol} color="purple">
            {t(`no_classes`)}
          </Alert>
        )}

        {nonArchived.length > 0 && (
          <Table hoverable={true} striped={true}>
            <Table.Head>
              <Table.HeadCell>{t('name')}</Table.HeadCell>
              <Table.HeadCell>{t('school_year')}</Table.HeadCell>
              <Table.HeadCell>{t('category')}</Table.HeadCell>
              <Table.HeadCell>{t('pupil_count')}</Table.HeadCell>
              <Table.HeadCell>{t('class_teacher')}</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {nonArchived.map((cls) => (
                <Table.Row
                  className={
                    'bg-white dark:border-gray-700 dark:bg-gray-800' +
                    (isLicenseValid(cls.license) ? '' : ' text-red-500')
                  }
                  key={cls.id}
                >
                  <Table.Cell>
                    <Badge className="w-fit" size="lg" color="purple">
                      {cls.name}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="font-medium">
                    {cls.license.validUntil.getFullYear() - 1 + '/' + cls.license.validUntil.getFullYear()}
                  </Table.Cell>
                  <Table.Cell className="font-medium">{tLists('grades.' + cls.grade)}</Table.Cell>
                  <Table.Cell className="font-medium">{cls.pupilCount}</Table.Cell>
                  <Table.Cell className="font-medium">
                    {cls.teacher && (
                      <Badge className="w-fit" size="lg" color="purple">
                        {cls.teacher.user.name}
                      </Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell className="float-right">
                    <Dropdown label={t('actions.title')} gradientDuoTone="purpleToBlue" outline pill>
                      {!isLicenseValid(cls.license) && (
                        <>
                          <Dropdown.Item
                            icon={HiArrowUpTray}
                            onClick={() => openUpgradeClassModal(cls)}
                            className="text-green-500"
                          >
                            {t('actions.upgrade')}
                          </Dropdown.Item>
                          <Dropdown.Divider />
                        </>
                      )}
                      <Dropdown.Item
                        icon={HiOutlineUserGroup}
                        onClick={() => router.push(`/dashboard/classes/pupils/${cls.id}`)}
                      >
                        {t('actions.pupil_list')}
                      </Dropdown.Item>
                      <Dropdown.Item icon={HiOutlinePencilSquare} onClick={() => openEditClassModal(cls)}>
                        {t('actions.edit')}
                      </Dropdown.Item>
                      {false && (
                        <>
                          <Dropdown.Item icon={HiOutlineKey}>{t('actions.generate_passwords')}</Dropdown.Item>
                        </>
                      )}
                      {isAdminOrManager && (
                        <>
                          <Dropdown.Item
                            icon={HiOutlineArchiveBoxArrowDown}
                            onClick={() => handleArchiveClassClick(cls.id)}
                          >
                            {t('actions.archive')}
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item
                            icon={HiOutlineTrash}
                            onClick={() => handleDeleteClassClick(cls.id)}
                            className="text-red-500"
                          >
                            {t('actions.delete')}
                          </Dropdown.Item>
                        </>
                      )}
                    </Dropdown>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}

        <div className="w-auto mt-4">
          <Alert icon={HiOutlineInformationCircle}>
            <span>
              <strong>{t('archive_info')}</strong>
            </span>
          </Alert>
        </div>

        {archived.length > 0 && (
          <>
            <h2 className="text-md mt-10 grow font-bold">{t('archive')}</h2>
            <div className="mt-4">
              <Table hoverable={true} striped={true}>
                <Table.Head>
                  <Table.HeadCell>{t('name')}</Table.HeadCell>
                  <Table.HeadCell>{t('school_year')}</Table.HeadCell>
                  <Table.HeadCell>{t('category')}</Table.HeadCell>
                  <Table.HeadCell>{t('pupil_count')}</Table.HeadCell>
                  <Table.HeadCell>{t('class_teacher')}</Table.HeadCell>
                  <Table.HeadCell></Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {archived.map((cls) => (
                    <Table.Row className={'bg-white dark:border-gray-700 dark:bg-gray-800'} key={cls.id}>
                      <Table.Cell>
                        <Badge className="w-fit" size="lg" color="purple">
                          {cls.name}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell className="font-medium">
                        {cls.license.validUntil.getFullYear() - 1 + '/' + cls.license.validUntil.getFullYear()}
                      </Table.Cell>
                      <Table.Cell className="font-medium">{tLists('grades.' + cls.grade)}</Table.Cell>
                      <Table.Cell className="font-medium">{cls.pupilCount}</Table.Cell>
                      <Table.Cell className="font-medium">
                        {cls.teacher && (
                          <Badge className="w-fit" size="lg" color="purple">
                            {cls.teacher.user.name}
                          </Badge>
                        )}
                      </Table.Cell>
                      <Table.Cell className="float-right">
                        <Dropdown label={t('actions.title')} gradientDuoTone="purpleToBlue" outline pill>
                          <Dropdown.Item
                            icon={HiOutlineUserGroup}
                            onClick={() => router.push(`/dashboard/classes/pupils/${cls.id}`)}
                          >
                            {t('actions.pupil_list')}
                          </Dropdown.Item>
                          {isAdminOrManager && (
                            <>
                              <Dropdown.Divider />
                              <Dropdown.Item
                                icon={HiOutlineTrash}
                                onClick={() => handleDeleteClassClick(cls.id)}
                                className="text-red-500"
                              >
                                {t('actions.delete')}
                              </Dropdown.Item>
                            </>
                          )}
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
      {openUpgradeModal && selectedClass && (
        <UpgradeClassModal
          openModal={openUpgradeModal}
          setOpenModal={setOpenUpgradeModal}
          selectedClass={selectedClass}
          onSubmit={updateClass}
        />
      )}
      {openEditModal && selectedClass && (
        <EditClassModal
          openModal={openEditModal}
          setOpenModal={setOpenEditModal}
          selectedClass={selectedClass}
          onSubmit={updateClass}
        />
      )}
    </div>
  );
}
