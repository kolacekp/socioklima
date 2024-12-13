'use client';

import { useConfirm } from '@/app/components/confirm/confirmProvider';
import { Alert, Badge, Button, Dropdown, Table, ToggleSwitch, Tooltip } from 'flowbite-react';
import { PupilDto } from '@/models/pupils/pupilDto';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  HiOutlineBarsArrowUp,
  HiOutlineCheckCircle,
  HiOutlineDocumentCheck,
  HiOutlineKey,
  HiOutlineNoSymbol,
  HiOutlinePencilSquare,
  HiOutlinePlusCircle,
  HiOutlineTrash
} from 'react-icons/hi2';
import PasswordModal from './passwordModal';
import PupilEditModal from './pupilEditModal';
import Link from 'next/link';
import { PupilEditConsentInterface } from '@/app/api/pupils/consent/route';
import PasswordsModal from './passwordsModal';
import ImportModal from './importModal';
import {
  ClassGeneratePasswordsRequest,
  ClassGeneratePasswordsResponseObject
} from '@/app/api/classes/generate-passwords/route';
import PupilCreateModal from './pupilCreateModal';

export default function PupilList({
  pupilList,
  classId,
  className,
  isLicenseValid
}: {
  pupilList: PupilDto[];
  classId: string;
  className: string;
  isLicenseValid: boolean;
}) {
  const [pupils, setPupils] = useState(pupilList);
  const [selectedPupil, setSelectedPupil] = useState<PupilDto | null>(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [openPasswordsModal, setOpenPasswordsModal] = useState(false);
  const [openImportModal, setOpenImportModal] = useState(false);
  const [password, setPassword] = useState<string | null>(null);
  const [toggleProcessing, setToggleProcessing] = useState<boolean>(false);
  const [consentProcessing, setConsentProcessing] = useState(false);
  const [passwordsProcessing, setPasswordsProcessing] = useState(false);

  const [passwords, setPasswords] = useState<Array<ClassGeneratePasswordsResponseObject>>([]);

  const t = useTranslations('dashboard.pupils.list');
  const tLists = useTranslations('lists');

  const { showConfirm } = useConfirm();

  const sortPupils = (pupils: PupilDto[]) => {
    return pupils.sort((a, b) => {
      if (a.number !== b.number) return a.number - b.number;
      return a.user.name!.localeCompare(b.user.name!);
    });
  };

  const handleDeletePupilClick = async (id: string) => {
    showConfirm({
      title: t('confirm_delete_title'),
      confirmMessage: t('confirm_delete_message'),
      async onConfirm() {
        const response = await fetch('/api/pupils/delete', {
          method: 'POST',
          body: JSON.stringify({ id }),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          toast.success(t('pupil_deleted'));
          setPupils((pupils) => {
            const newPupils = pupils.filter((pupil) => pupil.id !== id);
            return newPupils;
          });
        } else {
          toast.error(t('pupil_deleted_fail'));
        }
      }
    });
  };

  const handleCreatePupilClick = () => {
    setSelectedPupil(null);
    setOpenCreateModal(true);
  };

  const handleEditPupilClick = (pupil: PupilDto) => {
    setSelectedPupil(pupil);
    setOpenEditModal(true);
  };

  const handlePasswordResetClick = (pupil: PupilDto) => {
    showConfirm({
      title: t('confirm_password_reset_title'),
      confirmMessage: t('confirm_password_reset_message'),
      async onConfirm() {
        const response = await fetch('/api/users/generate-password', {
          method: 'POST',
          body: JSON.stringify({ userId: pupil.user.id })
        });

        if (response.ok) {
          toast.success(t('password_generated'));
          const resJson = await response.json();
          if (resJson.password) {
            setSelectedPupil(pupil);
            setPassword(resJson.password);
            setOpenPasswordModal(true);
          }
        } else {
          toast.error(t('password_generate_failure'));
        }
      }
    });
  };

  const insertPupil = (createdPupil: PupilDto, password: string) => {
    const newPupils = pupils;
    newPupils.push(createdPupil);
    sortPupils(newPupils);
    setPupils(newPupils);
    setSelectedPupil(createdPupil);
    setPassword(password);
    setOpenPasswordModal(true);
  };

  const updatePupil = (updatedPupil: PupilDto) => {
    const updatedPupils = pupils.map((pupil) => {
      if (pupil.id === updatedPupil.id) {
        return updatedPupil;
      }
      return pupil;
    });
    sortPupils(updatedPupils);
    setPupils(updatedPupils);
  };

  const handlePupilConsentClick = async (pupil: PupilDto) => {
    setToggleProcessing(true);
    const response = await fetch('/api/pupils/consent', {
      method: 'POST',
      body: JSON.stringify({
        pupilIds: [pupil.id],
        consent: !pupil.consent
      } as PupilEditConsentInterface)
    });

    if (response.ok) {
      const newPupils = pupils.map((p) => {
        if (p.id == pupil.id) p.consent = !p.consent;
        return p;
      });
      setPupils(newPupils);
      toast.success(t('consent_done') + ' - ' + pupil.user.name);
    } else {
      toast.error(t('consent_fail') + ' - ' + pupil.user.name);
    }
    setToggleProcessing(false);
  };

  const approveConsentAll = async (classId: string) => {
    showConfirm({
      title: t('consent_all_confirm_title'),
      confirmMessage: t('consent_all_confirm_message'),
      async onConfirm() {
        setConsentProcessing(true);
        const response = await fetch('/api/pupils/consent', {
          method: 'POST',
          body: JSON.stringify({
            classId: classId,
            consent: true
          } as PupilEditConsentInterface)
        });

        if (response.ok) {
          toast.success(t('consent_all_done'));
          setPupils(
            pupils.map((p) => {
              p.consent = true;
              return p;
            })
          );
        } else {
          toast.error('consent_all_fail');
        }
        setConsentProcessing(false);
      }
    });
  };

  const generatePasswordAll = async (classId: string) => {
    showConfirm({
      title: t('generate_password_all_confirm_title'),
      confirmMessage: t('generate_password_all_confirm_message'),
      async onConfirm() {
        setPasswordsProcessing(true);
        const response = await fetch('/api/classes/generate-passwords', {
          method: 'POST',
          body: JSON.stringify({
            classId: classId
          } as ClassGeneratePasswordsRequest)
        });
        if (response.ok) {
          toast.success(t('generate_password_all_done'));
          const resJson = (await response.json()) as Array<ClassGeneratePasswordsResponseObject>;
          if (resJson.length) {
            setPasswords(resJson);
            setOpenPasswordsModal(true);
          }
        } else {
          toast.error(t('generate_password_all_fail'));
        }
        setPasswordsProcessing(false);
      }
    });
  };

  const handleImportDone = () => {
    setOpenImportModal(false);
    setTimeout(() => {
      window.location.href = '/dashboard/classes/pupils/' + classId;
    }, 500);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <h1 className="text-xl mt-2 text-purple-600 grow font-bold dark:text-white">
          {t('title')} {className}
        </h1>
      </div>
      <div>
        {isLicenseValid && (
          <div className="flex flex-row gap-2">
            {pupils.length > 0 && (
              <div>
                <Button
                  outline
                  pill
                  className="w-fit"
                  gradientDuoTone="purpleToBlue"
                  onClick={() => window.open(`/documents/pupilConsent/class/${classId}`)}
                >
                  <p>{t('generate_consent_all')}</p>
                  <HiOutlineDocumentCheck className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
            {pupils.length > 0 && (
              <div>
                <Button
                  outline
                  pill
                  className="w-fit"
                  gradientDuoTone="purpleToBlue"
                  onClick={() => approveConsentAll(classId)}
                  isProcessing={consentProcessing}
                >
                  <p>{t('approve_consent_all')}</p>
                  <HiOutlineCheckCircle className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
            {pupils.length > 0 && (
              <div>
                <Button
                  outline
                  pill
                  className="w-fit"
                  gradientDuoTone="purpleToBlue"
                  onClick={() => generatePasswordAll(classId)}
                  isProcessing={passwordsProcessing}
                >
                  <p>{t('generate_password_all')}</p>
                  <HiOutlineKey className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
            <div>
              <Button
                outline
                pill
                className="w-fit"
                gradientDuoTone="purpleToBlue"
                onClick={() => handleCreatePupilClick()}
              >
                <p>{t('add_pupil')}</p>
                <HiOutlinePlusCircle className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div>
              <Button
                outline
                pill
                className="w-fit"
                gradientDuoTone="purpleToBlue"
                onClick={() => setOpenImportModal(true)}
              >
                <p>{t('import_pupils')}</p>
                <HiOutlineBarsArrowUp className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-2">
        {pupils.length == 0 && (
          <Alert icon={HiOutlineNoSymbol} color="purple">
            {t(`no_pupils`)}
          </Alert>
        )}

        {pupils.length > 0 && (
          <Table hoverable={true} striped={true}>
            <Table.Head>
              <Table.HeadCell>{t('number')}</Table.HeadCell>
              <Table.HeadCell>{t('name')}</Table.HeadCell>
              <Table.HeadCell>{t('username')}</Table.HeadCell>
              <Table.HeadCell>{t('gender')}</Table.HeadCell>
              <Table.HeadCell>{t('nationality')}</Table.HeadCell>
              <Table.HeadCell>{t('consent')}</Table.HeadCell>
              {isLicenseValid && <Table.HeadCell></Table.HeadCell>}
            </Table.Head>
            <Table.Body className="divide-y">
              {pupils.map((pupil) => (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={pupil.id}>
                  <Table.Cell className="font-medium">{pupil.number}</Table.Cell>
                  <Table.Cell className="font-medium">{pupil.user.name}</Table.Cell>
                  <Table.Cell>
                    {pupil.user.username && (
                      <Badge className="w-fit" size="lg" color="success">
                        {pupil.user.username}
                      </Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell className="font-medium">{tLists('genders.' + pupil.gender)}</Table.Cell>
                  <Table.Cell className="font-medium">{pupil.nationality ?? t('not_filled')}</Table.Cell>
                  <Table.Cell>
                    <Tooltip content={t('consent_switch')}>
                      <ToggleSwitch
                        color="purple"
                        label=""
                        checked={pupil.consent}
                        onChange={() => handlePupilConsentClick(pupil)}
                        disabled={toggleProcessing}
                      />
                    </Tooltip>
                  </Table.Cell>
                  {isLicenseValid && (
                    <Table.Cell className="float-right">
                      <Dropdown label={t('actions')} gradientDuoTone="purpleToBlue" outline pill>
                        <Dropdown.Item icon={HiOutlinePencilSquare} onClick={() => handleEditPupilClick(pupil)}>
                          {t('edit')}
                        </Dropdown.Item>
                        <Dropdown.Item icon={HiOutlineDocumentCheck}>
                          <Link href={`/documents/pupilConsent/${pupil.id}`} target="_blank">
                            {t('consent_pdf')}
                          </Link>
                        </Dropdown.Item>
                        <Dropdown.Item icon={HiOutlineKey} onClick={() => handlePasswordResetClick(pupil)}>
                          {t('generate_password')}
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item
                          icon={HiOutlineTrash}
                          className="text-red-500"
                          onClick={() => handleDeletePupilClick(pupil.id)}
                        >
                          {t('delete')}
                        </Dropdown.Item>
                      </Dropdown>
                    </Table.Cell>
                  )}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>

      {openCreateModal && (
        <PupilCreateModal
          openModal={openCreateModal}
          classId={classId}
          genderRequired={false}
          onClose={() => setOpenCreateModal(false)}
          onSave={insertPupil}
        />
      )}

      {openEditModal && selectedPupil && (
        <PupilEditModal
          openModal={openEditModal}
          selectedPupil={selectedPupil!}
          genderRequired={false}
          onClose={() => setOpenEditModal(false)}
          onSave={updatePupil}
        />
      )}

      {openPasswordModal && selectedPupil && password && (
        <PasswordModal
          openModal={openPasswordModal}
          password={password}
          pupil={selectedPupil}
          onClose={() => setOpenPasswordModal(false)}
        />
      )}

      {openPasswordsModal && passwords.length && (
        <PasswordsModal
          openModal={openPasswordsModal}
          className={className}
          passwords={passwords}
          onClose={() => setOpenPasswordsModal(false)}
        />
      )}

      {openImportModal && (
        <ImportModal
          openModal={openImportModal}
          classId={classId}
          className={className}
          onClose={() => setOpenImportModal(false)}
          onSave={handleImportDone}
        />
      )}
    </div>
  );
}
