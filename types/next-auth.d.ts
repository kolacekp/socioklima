import 'next-auth';

interface ActiveSchool {
  id: string;
  schoolName: string;
}

interface Impersonated {
  id: string;
  email: string;
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id?: string;
      userName?: string;
      email?: string | null;
      name?: string | null;
      roles?: Role[];
      activeSchool?: ActiveSchool | undefined;
      principal?: Principal;
      expert?: Expert;
      teacher?: Teacher;
      // used for impersonation - logging back
      impersonated?: Impersonated | undefined;
    };
  }
}
