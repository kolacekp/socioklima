import React, { Suspense } from 'react';

import FlowbiteContext from '../../context/flowbiteContext';
import { SidebarProvider } from '../../context/sidebarContext';
import { AppContextProvider } from './components/appContextProvider';
import HeaderWrapper from './components/headerWrapper';
import NextAuthProvider from './components/nextAuthProvider';
import Sidebar from './components/sidebar';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { Role } from '@prisma/client';
import { SignOutProvider } from '../../context/signOutContext';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const roles = session?.user.roles ?? ([] as Role[]);
  const roleSlugs = roles.map((role: Role) => {
    return role.slug;
  });

  return (
    <FlowbiteContext>
      <NextAuthProvider>
        <SignOutProvider>
          <AppContextProvider>
            <SidebarProvider>
              <div className="flex flex-col h-screen min-h-screen">
                <Suspense fallback="...">
                  <HeaderWrapper />
                </Suspense>
                <div className="flex-1 overflow-y-auto">
                  <div className="flex h-full dark:bg-gray-900">
                    <main className="order-2 relative px-4 pt-4 pb-8 h-full flex-[1_0_16rem] overflow-y-auto">
                      {children}
                    </main>
                    <div className="order-1">
                      <Sidebar roles={roleSlugs} />
                    </div>
                  </div>
                </div>
              </div>
            </SidebarProvider>
          </AppContextProvider>
        </SignOutProvider>
      </NextAuthProvider>
    </FlowbiteContext>
  );
}
