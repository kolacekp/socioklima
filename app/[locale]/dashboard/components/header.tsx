'use client';

import { Navbar } from 'flowbite-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useSidebarContext } from '../../../context/sidebarContext';
import ActiveSchool from './activeSchool';
import HeaderUserDropdown from './headerUserDropdown';
import LanguageSwitcher from './languageSwitcher';

export default function Header({ user, showSchoolSelector }: { user: any; showSchoolSelector: boolean }) {
  const { isOpenOnSmallScreens, isPageWithSidebar, setOpenOnSmallScreens } = useSidebarContext();

  const tAssets = useTranslations('assets');

  return (
    <Navbar fluid>
      {isPageWithSidebar && (
        <button
          aria-controls="sidebar"
          aria-expanded="true"
          className="mr-2 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2
            focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700
            lg:hidden"
          onClick={() => setOpenOnSmallScreens(!isOpenOnSmallScreens)}
        >
          {isOpenOnSmallScreens ? (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414
                   1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1
                   0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          )}
        </button>
      )}
      <Navbar.Brand href="/">
        <Image alt="Socioklima logo" height="24" src={`/images/${tAssets('logo')}`} width="96" />
      </Navbar.Brand>
      <div className="flex md:order-2">
        {user && <HeaderUserDropdown user={user} />}
        <LanguageSwitcher />
      </div>
      {showSchoolSelector && <ActiveSchool activeSchool={user.activeSchool} />}
    </Navbar>
  );
}
