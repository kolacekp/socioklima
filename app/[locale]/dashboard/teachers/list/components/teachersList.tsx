'use client';

import { useConfirm } from '@/app/components/confirm/confirmProvider';
import { Alert, Badge, Button, Dropdown, Table } from 'flowbite-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  HiOutlineKey,
  HiOutlinePencilSquare,
  HiOutlineUserGroup,
  HiOutlineTrash,
  HiOutlineNoSymbol
} from 'react-icons/hi2';
import { ClassDto } from '@/models/classes/class.dto';
import { TeacherDto } from '@/models/teachers/teacher.dto';
import EditTeacherModal from './modals/editTeacherModal';
import PasswordModal from './modals/passwordModal';
import TeacherClassesModal from './modals/teacherClassesModal';
import { TeacherDeleteRequest } from '@/app/api/teachers/delete/route';
import CreateTeacherModal from './modals/createTeacherModal';

export default function TeachersList({
  schoolId,
  teachers,
  classes
}: {
  schoolId: string;
  teachers: TeacherDto[];
  classes: ClassDto[];
}) {
  const t = useTranslations('dashboard.teachers.list');

  const [teachersList, setTeachersList] = useState<TeacherDto[]>(teachers);
  const [classesList] = useState<ClassDto[]>(classes);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherDto | null>(null);
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false);
  const [openClassesModal, setOpenClassesModal] = useState<boolean>(false);
  const [password, setPassword] = useState<string | null>(null);

  const { showConfirm } = useConfirm();

  const sortTeachers = (teachers: TeacherDto[]) => {
    return teachers.sort((a, b) => {
      return a.user.name!.localeCompare(b.user.name!);
    });
  };

  const handleCreateTeacher = () => {
    setSelectedTeacher(null);
    setOpenCreateModal(true);
  };

  const handleEditTeacher = (selectedTeacher: TeacherDto) => {
    setSelectedTeacher(selectedTeacher);
    setOpenEditModal(true);
  };

  const handleEditModalSave = (updatedTeacher: TeacherDto) => {
    const updatedTeachers = teachersList.map((teacher) => {
      if (teacher.id === updatedTeacher.id) {
        return updatedTeacher;
      }
      return teacher;
    });
    sortTeachers(updatedTeachers);
    setTeachersList(updatedTeachers);
  };

  const handleCreateModalSave = (createdTeacher: TeacherDto, password: string) => {
    const newTeachersList = teachersList;
    newTeachersList.push(createdTeacher);
    sortTeachers(newTeachersList);
    setTeachersList(newTeachersList);
    setSelectedTeacher(createdTeacher);
    setPassword(password);
    setOpenPasswordModal(true);
  };

  const handleTeacherRecordUpdated = (updatedTeacher: TeacherDto) => {
    const updatedTeachersList = teachersList.map((teacher) => {
      if (teacher.id === updatedTeacher.id) {
        return updatedTeacher;
      }
      return teacher;
    });
    sortTeachers(updatedTeachersList);
    setTeachersList(updatedTeachersList);
  };

  const handleCreateModalClose = () => {
    setSelectedTeacher(null);
    setOpenCreateModal(false);
  };

  const handleEditModalClose = () => {
    setSelectedTeacher(null);
    setOpenEditModal(false);
  };

  const handlePasswordModalClose = () => {
    setPassword(null);
    setOpenPasswordModal(false);
  };

  const handlePasswordResetClick = (st: TeacherDto) => {
    showConfirm({
      title: t('confirm_password_reset_title'),
      confirmMessage: t('confirm_password_reset_message'),
      async onConfirm() {
        const response = await fetch('/api/users/generate-password', {
          method: 'POST',
          body: JSON.stringify({ userId: st.user.id })
        });

        if (response.ok) {
          toast.success(t('password_generated'));
          const resJson = await response.json();
          if (resJson.password) {
            setSelectedTeacher(st);
            setPassword(resJson.password);
            setOpenPasswordModal(true);
          }
        } else {
          toast.error(t('password_generate_failure'));
        }
      }
    });
  };

  const handleClassesClick = async (selectedTeacher: TeacherDto) => {
    setPassword(null);
    setSelectedTeacher(selectedTeacher);
    setOpenClassesModal(true);
  };

  const handleClassesModalClose = () => {
    setSelectedTeacher(null);
    setOpenClassesModal(false);
  };

  const handleDeleteClick = (st: TeacherDto) => {
    showConfirm({
      title: t('confirm_teacher_delete_title'),
      confirmMessage: t('confirm_teacher_delete_message'),
      async onConfirm() {
        const response = await fetch('/api/teachers/delete', {
          method: 'POST',
          body: JSON.stringify({ teacherId: st.id } as TeacherDeleteRequest)
        });
        if (response.ok) {
          toast.success(t('teacher_deleted'));
          setTeachersList((data) => data.filter((item: TeacherDto) => item.id !== st.id));
        } else {
          toast.error(t('teacher_deleted_fail'));
        }
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <h1 className="text-xl mt-2 text-purple-600 grow font-bold dark:text-white">{t('teachers')}</h1>
        <Button outline pill gradientDuoTone="purpleToBlue" onClick={() => handleCreateTeacher()}>
          {t('add_teacher')}
        </Button>
      </div>
      <div className="mt-2">
        {teachersList.length == 0 && (
          <Alert icon={HiOutlineNoSymbol} color="purple">
            {t(`no_teachers`)}
          </Alert>
        )}

        {teachersList.length > 0 && (
          <Table hoverable={true} striped={true}>
            <Table.Head>
              <Table.HeadCell>{t('name')}</Table.HeadCell>
              <Table.HeadCell>{t('email')}</Table.HeadCell>
              <Table.HeadCell>{t('phone')}</Table.HeadCell>
              <Table.HeadCell>{t('teacher_for_classes')}</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {teachersList.map((teacher) => (
                <Table.Row key={teacher.id}>
                  <Table.Cell className="font-medium">{teacher.user.name}</Table.Cell>
                  <Table.Cell>
                    {teacher.user.email && (
                      <a
                        href={`mailto:${teacher.user.email}`}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        {teacher.user.email}
                      </a>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {teacher.user.phone && (
                      <a
                        href={`tel:${teacher.user.phone}`}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        {teacher.user.phone}
                      </a>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {teacher.classes.length > 0 && (
                      <div className="flex flex-row gap-2">
                        {teacher.classes.map((c: ClassDto) => (
                          <Badge key={c.id} className="w-fit" size="lg" color="purple">
                            {c.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Dropdown label={t('actions')} gradientDuoTone="purpleToBlue" outline pill>
                      <Dropdown.Item icon={HiOutlinePencilSquare} onClick={() => handleEditTeacher(teacher)}>
                        {t('edit')}
                      </Dropdown.Item>
                      <Dropdown.Item icon={HiOutlineKey} onClick={() => handlePasswordResetClick(teacher)}>
                        {t('generate_password')}
                      </Dropdown.Item>
                      <Dropdown.Item icon={HiOutlineUserGroup} onClick={() => handleClassesClick(teacher)}>
                        {t('manage_classes')}
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        icon={HiOutlineTrash}
                        className="text-red-500"
                        onClick={() => handleDeleteClick(teacher)}
                      >
                        {t('delete')}
                      </Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>

      {openCreateModal && (
        <CreateTeacherModal
          schoolId={schoolId}
          openModal={openCreateModal}
          onClose={handleCreateModalClose}
          onSave={handleCreateModalSave}
        />
      )}

      {openEditModal && selectedTeacher && (
        <EditTeacherModal
          openModal={openEditModal}
          selectedTeacher={selectedTeacher}
          onClose={handleEditModalClose}
          onSave={handleEditModalSave}
        />
      )}

      {openPasswordModal && selectedTeacher && password && (
        <PasswordModal
          openModal={openPasswordModal}
          teacher={selectedTeacher}
          password={password}
          onClose={handlePasswordModalClose}
        />
      )}

      {openClassesModal && selectedTeacher && (
        <TeacherClassesModal
          openModal={openClassesModal}
          selectedTeacher={selectedTeacher}
          classes={classesList}
          onClose={handleClassesModalClose}
          onUpdate={handleTeacherRecordUpdated}
        />
      )}
    </div>
  );
}
