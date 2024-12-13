import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['cs', 'sk'] as const;

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({ locales });
