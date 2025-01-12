import { withAuth } from 'next-auth/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const locales = ['cs', 'sk'];
const publicPages = ['/login', '/register', '/verification', '/forgotten-password'];

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'cs'
});

const authMiddleware = withAuth(
  // Note that this callback is only invoked if
  // the `authorized` callback has returned `true`
  // and not for pages listed in `pages`.
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null
    },
    pages: {
      signIn: '/login',
      newUser: '/register'
    }
  }
);

export default async function middleware(req: NextRequest) {
  // redirect to "dashboard" by default
  if (req.nextUrl.pathname == '/') return (authMiddleware as any)(req);

  const publicPathnameRegex = RegExp(
    `^(/(${locales.join('|')}))?(${publicPages.flatMap((p) => (p === '/' ? ['', '/'] : p)).join('|')})/?.*$`,
    'i'
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    return (authMiddleware as any)(req);
  }
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/', '/((?!api|_next|.*\\..*).*)']
};
