import { Alert, Button, Modal, Spinner, Table, Tooltip } from 'flowbite-react';
import { useTranslations } from 'next-intl';

import { useConfirm } from '@/app/components/confirm/confirmProvider';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineInformationCircle, HiOutlineXCircle } from 'react-icons/hi2';
import { ClassDto } from '@/models/classes/class.dto';
import { TeacherDto } from '@/models/teachers/teacher.dto';

import { ErrorsEnum } from '@/utils/errors.enum';

export interface TeacherClassesUpdateValues {
  teacherId: string;
  classId: string;
}

export default function TeacherClassesModal({
  openModal,
  selectedTeacher,
  classes,
  onClose,
  onUpdate
}: {
  openModal: boolean;
  selectedTeacher: TeacherDto;
  classes: ClassDto[];
  onClose: () => void;
  onUpdate: (updatedTeacher: TeacherDto) => void;
}) {
  const t = useTranslations('dashboard.teachers.classesModal');
  const tGeneral = useTranslations('dashboard.general');

  const [teacher, setTeacher] = useState<TeacherDto>(selectedTeacher);
  const [classesAvailable, setClassesAvailable] = useState<ClassDto[]>(classes);
  const [loading, setLoading] = useState<string | null>(null);
  const { showConfirm } = useConfirm();

  const handleTeacherClassAdded = async (cls: ClassDto) => {
    setLoading(cls.id);
    const response = await fetch('/api/teachers/addClass', {
      method: 'POST',
      body: JSON.stringify({
        teacherId: teacher.id,
        classId: cls.id
      } as TeacherClassesUpdateValues)
    });

    if (response.ok) {
      const res = await response.json();
      if (res.teacher) {
        setTeacher(res.teacher);
        setClassesAvailable(classesAvailable.filter((c: ClassDto) => c.id != cls.id));
        onUpdate(res.teacher);
        toast.success(t('teacher_class_added'));
      }
    } else {
      const res = await response.json();
      if (res.code && res.code == ErrorsEnum.E_NON_EXISTING_TEACHER) {
        toast.error(t('non_existing_teacher'));
      } else if (res.code && res.code == ErrorsEnum.E_CLASS_ALREADY_ASSIGNED) {
        toast.error(t('class_already_assigned'));
      } else {
        toast.error(t('class_assign_error'));
      }
    }
    setLoading(null);
  };

  const handleTeacherClassRemoved = async (cls: ClassDto) => {
    showConfirm({
      title: t('confirm_class_remove_title'),
      confirmMessage: t('confirm_class_remove_message'),
      async onConfirm() {
        const response = await fetch('/api/teachers/removeClass', {
          method: 'POST',
          body: JSON.stringify({
            teacherId: teacher.id,
            classId: cls.id
          } as TeacherClassesUpdateValues)
        });

        if (response.ok) {
          const res = await response.json();
          if (res.teacher) {
            setTeacher(res.teacher);
            const newClassList = classesAvailable;
            newClassList.push(cls);
            setClassesAvailable(newClassList);
            onUpdate(res.teacher);
            toast.success(t('teacher_class_removed'));
          }
        } else {
          toast.error(t('class_unassigned_error'));
        }
      }
    });
  };

  return (
    <Modal dismissible show={openModal} onClose={onClose} className="z-40">
      <Modal.Header>
        {t('editing_teacher_classes')} {selectedTeacher.user.name}
      </Modal.Header>
      <Modal.Body>
        {classesAvailable.length > 0 && (
          <>
            <h6 className="text-lg font-bold dark:text-white">{t('classes_without_teacher')}</h6>
            <p className="text-sm">{t('add_info')}</p>
            <div className="mt-4 flex flex-row gap-2">
              {classesAvailable.map((cls) => (
                <Tooltip key={cls.id} content={t('add_class_to_teacher')}>
                  <Button
                    size="sm"
                    pill={true}
                    outline={true}
                    gradientDuoTone="purpleToBlue"
                    className="mb-2"
                    onClick={() => handleTeacherClassAdded(cls)}
                  >
                    {loading && loading == cls.id && <Spinner size="sm" className="mr-2" />} {cls.name}
                  </Button>
                </Tooltip>
              ))}
            </div>
            <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />
          </>
        )}

        <h6 className="text-lg font-bold dark:text-white">{t('teacher_classes')}</h6>
        {teacher.classes.length == 0 && (
          <Alert icon={HiOutlineInformationCircle} color="failure" className="mt-4">
            {t('no_teacher_classes')}
          </Alert>
        )}
        {teacher.classes.length > 0 && (
          <Table hoverable={true} className="mt-4 table-auto" striped={true}>
            <Table.Body className="divide-y">
              {teacher.classes.map((cls) => (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={cls.id}>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {cls.name}
                  </Table.Cell>
                  <Table.Cell align="right">
                    <Tooltip content={t('remove_class')} placement="left">
                      <Button
                        size="sm"
                        pill={true}
                        outline={true}
                        gradientDuoTone="purpleToBlue"
                        onClick={() => handleTeacherClassRemoved(cls)}
                      >
                        <HiOutlineXCircle className="h-5 w-5" />
                      </Button>
                    </Tooltip>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button outline pill gradientDuoTone="pinkToOrange" color="danger" onClick={onClose}>
          <p>{tGeneral('close')}</p>
          <HiOutlineXCircle className="ml-2 h-5 w-5" />
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
