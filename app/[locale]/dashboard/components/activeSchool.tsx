'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { HiOutlineBuildingLibrary } from 'react-icons/hi2';
import SchoolSelectModal from './schoolSelectModal';
import { Button } from 'flowbite-react';

export default function ActiveSchool({ activeSchool }: { activeSchool: any }) {
  const [openModal, setOpenModal] = useState(false);
  const t = useTranslations('dashboard.school_selector');
  const session: any = useSession();

  const handleOpenModal = async () => {
    setOpenModal(true);
  };

  return (
    <>
      <Button gradientDuoTone="purpleToBlue" outline pill onClick={handleOpenModal}>
        <HiOutlineBuildingLibrary className="mr-2 h-5 w-5" />
        <p>
          {session.data
            ? session.data.user?.activeSchool?.id
              ? session.data?.user?.activeSchool?.schoolName
              : t('school_selection')
            : activeSchool?.id
            ? activeSchool?.schoolName
            : t('school_selection')}
        </p>
      </Button>

      {openModal && <SchoolSelectModal openModal={openModal} setOpenModal={setOpenModal} />}
    </>
  );
}
