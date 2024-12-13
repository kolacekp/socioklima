'use client';

import { License } from '@prisma/client';
import { Tabs } from 'flowbite-react';
import { useTranslations } from 'next-intl';
import { HiOutlineIdentification, HiOutlineShoppingCart, HiOutlineUserGroup } from 'react-icons/hi2';
import SchoolInfoTab from './schoolInfoTab';
import SchoolLicensesTab from './schoolLicensesTab';
import { SchoolDetailWithUsers } from '@/models/schools/schoolDetailWithUsers';
import SchoolUsersTab from './schoolUsersTab';
import { useState } from 'react';

export default function SchoolDetailTabs({
  schoolDetail,
  licenses,
  userRoles
}: {
  schoolDetail: SchoolDetailWithUsers;
  licenses: License[];
  userRoles: string[];
}) {
  const [school, setSchool] = useState<SchoolDetailWithUsers>(schoolDetail);
  const t = useTranslations('dashboard.school.detail.tabs');

  return (
    <>
      <Tabs.Group aria-label="Full width tabs" style="fullWidth">
        <Tabs.Item active icon={HiOutlineIdentification} title={t('info.heading')}>
          <SchoolInfoTab school={school} setSchool={setSchool} userRoles={userRoles} />
        </Tabs.Item>
        <Tabs.Item icon={HiOutlineShoppingCart} title={t('licenses.heading')}>
          <SchoolLicensesTab licenses={licenses} />
        </Tabs.Item>
        <Tabs.Item icon={HiOutlineUserGroup} title={t('allowed_users.heading')}>
          <SchoolUsersTab school={school} />
        </Tabs.Item>
      </Tabs.Group>
    </>
  );
}
