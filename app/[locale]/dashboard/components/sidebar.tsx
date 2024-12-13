'use client';

import classNames from 'classnames';
import { Sidebar as FlowbiteSidebar } from 'flowbite-react';
import {
  HiOutlineAcademicCap,
  HiOutlineBanknotes,
  HiOutlineBuildingLibrary,
  //HiOutlineClipboardDocumentList,
  //HiOutlineCog8Tooth,
  HiOutlineDocumentArrowDown,
  HiOutlineDocumentChartBar,
  //HiOutlineLifebuoy,
  //HiOutlineListBullet,
  //HiOutlineSquares2X2,
  HiOutlineUserCircle,
  HiOutlineUserGroup,
  HiOutlineUsers,
  HiOutlineDocumentCheck
} from 'react-icons/hi2';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useSidebarContext } from '../../../context/sidebarContext';
import { RolesEnum } from '@/models/roles/roles.enum';

export default function Sidebar({ roles }: { roles: string[] }) {
  const { isOpenOnSmallScreens: isSidebarOpenOnSmallScreens } = useSidebarContext();

  const pathname = usePathname();

  const t = useTranslations('dashboard.sidebar');

  const isAdmin = roles.includes(RolesEnum.ADMINISTRATOR);
  const isSchoolManager = roles.includes(RolesEnum.SCHOOL_MANAGER);
  const isExpert = roles.includes(RolesEnum.EXPERT);
  const isTeacher = roles.includes(RolesEnum.TEACHER);
  const isPrincipal = roles.includes(RolesEnum.PRINCIPAL);

  const locale = useLocale();

  return (
    <div
      className={classNames(
        'fixed left-0 top-0 z-10 h-full overflow-auto border-r pt-28 md:pt-16 dark:border-gray-700 lg:sticky lg:!block lg:pt-0 ' +
          '-translate-x-full transition-transform sm:translate-x-0',
        {
          hidden: !isSidebarOpenOnSmallScreens
        }
      )}
    >
      <FlowbiteSidebar>
        <FlowbiteSidebar.Items>
          <FlowbiteSidebar.ItemGroup>
            {(isAdmin || isSchoolManager || isPrincipal) && (
              <FlowbiteSidebar.Item
                icon={HiOutlineBuildingLibrary}
                href="/dashboard/schools/list"
                active={
                  pathname?.includes('/dashboard/schools/list') || pathname?.includes('/dashboard/schools/register')
                }
                className="font-medium"
              >
                {t('school.heading')}
              </FlowbiteSidebar.Item>
            )}

            {(isAdmin || isSchoolManager || isPrincipal) && (
              <FlowbiteSidebar.Item
                icon={HiOutlineBanknotes}
                href="/dashboard/licenses/list"
                active={
                  pathname?.includes('/dashboard/licenses/list') || pathname?.includes('/dashboard/licenses/create')
                }
                className="font-medium"
              >
                {t('licenses.heading')}
              </FlowbiteSidebar.Item>
            )}

            {(isAdmin || isSchoolManager || isExpert || isTeacher || isPrincipal) && (
              <FlowbiteSidebar.Item
                icon={HiOutlineUserGroup}
                href="/dashboard/classes/list"
                active={
                  pathname?.includes('/dashboard/classes/list') || pathname?.includes('/dashboard/classes/create')
                }
                className="font-medium"
              >
                {t('classes.heading')}
              </FlowbiteSidebar.Item>
            )}

            <FlowbiteSidebar.Item
              icon={HiOutlineDocumentCheck}
              href="/dashboard/questionnaires"
              open={
                pathname?.includes('/dashboard/questionnaires') ||
                pathname?.includes('/dashboard/questionnaires/create')
              }
              className="font-medium"
            >
              {t('questionnaires.heading')}
            </FlowbiteSidebar.Item>

            {(isAdmin || isSchoolManager || isExpert || isPrincipal) && (
              <FlowbiteSidebar.Item
                icon={HiOutlineAcademicCap}
                href="/dashboard/teachers/list"
                active={
                  pathname?.includes('/dashboard/teachers/list') || pathname?.includes('/dashboard/teachers/create')
                }
                className="font-medium"
              >
                {t('teachers.heading')}
              </FlowbiteSidebar.Item>
            )}

            {(isAdmin || isSchoolManager || isPrincipal) && (
              <FlowbiteSidebar.Item
                icon={HiOutlineUserCircle}
                href="/dashboard/experts/list"
                active={
                  pathname?.includes('/dashboard/experts/list') || pathname?.includes('/dashboard/experts/create')
                }
                className="font-medium"
              >
                {t('experts.heading')}
              </FlowbiteSidebar.Item>
            )}
          </FlowbiteSidebar.ItemGroup>

          {isAdmin && (
            <FlowbiteSidebar.ItemGroup>
              <FlowbiteSidebar.Item
                icon={HiOutlineUsers}
                href="/dashboard/users/list"
                active={pathname?.includes('/dashboard/users/list')}
                className="font-medium"
              >
                {t('users.heading')}
              </FlowbiteSidebar.Item>
            </FlowbiteSidebar.ItemGroup>
          )}

          {(isAdmin || isSchoolManager || isExpert || isTeacher || isPrincipal) && (
            <FlowbiteSidebar.ItemGroup>
              <FlowbiteSidebar.Collapse
                icon={HiOutlineDocumentArrowDown}
                label={t('documents.heading')}
                className="font-medium"
              >
                <FlowbiteSidebar.Item
                  href={`/documents/blik_p_${locale}.pdf`}
                  target="_blank"
                  icon={HiOutlineDocumentChartBar}
                  className="font-medium"
                >
                  {t('documents.blik_working_sheet')}
                </FlowbiteSidebar.Item>
                <FlowbiteSidebar.Item
                  href={`/documents/blik_r_${locale}.pdf`}
                  target="_blank"
                  icon={HiOutlineDocumentChartBar}
                  className="font-medium"
                >
                  {t('documents.blik_solution')}
                </FlowbiteSidebar.Item>
              </FlowbiteSidebar.Collapse>
            </FlowbiteSidebar.ItemGroup>
          )}
        </FlowbiteSidebar.Items>
      </FlowbiteSidebar>
    </div>
  );
}
