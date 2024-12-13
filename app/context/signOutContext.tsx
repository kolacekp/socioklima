'use client';

import { createContext, PropsWithChildren, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';

const SignOutContext = createContext(undefined);

export function SignOutProvider({ children }: PropsWithChildren<Record<string, unknown>>) {
  const { data: session }: any = useSession();

  useEffect(() => {
    const signOutUser = async () => {
      if (session) {
        const res = await fetch('/api/auth/me', { method: 'POST' });

        if (res.status != 200) await signOut();
      }
    };

    void signOutUser().then(() => {});
  }, [session]);

  return <SignOutContext.Provider value={undefined}>{children}</SignOutContext.Provider>;
}
