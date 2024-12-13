import { Badge, Button, Modal, Table } from 'flowbite-react';
import { useTranslations } from 'next-intl';
import { ClassGeneratePasswordsResponseObject } from '@/app/api/classes/generate-passwords/route';
import { HiOutlineXCircle } from 'react-icons/hi2';
import { HiOutlineDocumentDownload } from 'react-icons/hi';
import Excel from 'exceljs';

export default function PasswordsModal({
  openModal,
  passwords,
  className,
  onClose
}: {
  openModal: boolean;
  passwords: Array<ClassGeneratePasswordsResponseObject>;
  className: string;
  onClose: () => void;
}) {
  const t = useTranslations('dashboard.pupils.passwords_modal');
  const tGeneral = useTranslations('dashboard.general');

  const handeExportPasswords = async () => {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(t('passwords'));

    worksheet.columns = [
      { key: 'pupilName', header: t('pupil_name') },
      { key: 'pupilUsername', header: t('pupil_username') },
      { key: 'password', header: t('password') }
    ];

    passwords.forEach((p: ClassGeneratePasswordsResponseObject) => {
      worksheet.addRow(p);
    });

    const blob = await workbook.xlsx.writeBuffer();

    // Create a download link and trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([blob]));
    link.download = 'hesla_export.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal show={openModal} onClose={onClose} size="4xl">
      <Modal.Header>
        {t('new_generated_passwords')} <span className="font-bold">{className}</span>
      </Modal.Header>
      <Modal.Body>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-base">{t('info')}</p>
          </div>
          <div>
            <Button outline pill gradientDuoTone="purpleToBlue" onClick={() => handeExportPasswords()}>
              <p>{t('export_passwords')}</p>
              <HiOutlineDocumentDownload className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div>
            <Table className="printable mt-4" striped>
              <Table.Row>
                <Table.HeadCell>{t('pupil_name')}</Table.HeadCell>
                <Table.HeadCell>{t('pupil_username')}</Table.HeadCell>
                <Table.HeadCell>{t('password')}</Table.HeadCell>
              </Table.Row>
              {passwords.map((p: ClassGeneratePasswordsResponseObject) => (
                <Table.Row key={p.pupilUsername}>
                  <Table.Cell>{p.pupilName}</Table.Cell>
                  <Table.Cell>{p.pupilUsername}</Table.Cell>
                  <Table.Cell>
                    <Badge color="success" className="justify-center">
                      <p className="text-lg">{p.password}</p>
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table>
          </div>
        </div>
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
