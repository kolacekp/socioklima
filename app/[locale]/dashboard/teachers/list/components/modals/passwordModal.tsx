import { Badge, Button, Modal } from 'flowbite-react';
import { useTranslations } from 'next-intl';
import { TeacherDto } from '@/models/teachers/teacher.dto';
import { HiOutlineXCircle } from 'react-icons/hi2';

export default function PasswordModal({
  openModal,
  teacher,
  password,
  onClose
}: {
  openModal: boolean;
  teacher: TeacherDto;
  password: string;
  onClose: () => void;
}) {
  const t = useTranslations('dashboard.teachers.passwordModal');
  const tGeneral = useTranslations('dashboard.general');

  return (
    <Modal show={openModal} onClose={onClose}>
      <Modal.Header>
        {t('new_generated_password')} - {teacher.user.name}
      </Modal.Header>
      <Modal.Body>
        <p className="text-base">{t('info')}</p>
        <br />
        <Badge color="success" className="justify-center">
          <p className="text-lg">{password}</p>
        </Badge>
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
