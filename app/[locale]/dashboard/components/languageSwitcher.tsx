'use client';

import { Dropdown } from 'flowbite-react';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/app/components/navgiation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const mapLocaleToLabel = (locale: string) => {
    switch (locale) {
      case 'cs':
      default:
        return 'CZ';

      case 'sk':
        return 'SK';
    }
  };

  return (
    <div className="mx-2">
      <Dropdown arrowIcon={false} label={mapLocaleToLabel(locale)} gradientDuoTone="purpleToBlue" outline pill>
        <Dropdown.Item key="cs" id="cs" className="text-md">
          <Link href={pathname} locale="cs">
            CZ
          </Link>
        </Dropdown.Item>
        <Dropdown.Item key="sk" id="sk" className="text-md">
          <Link href={pathname} locale="sk">
            SK
          </Link>
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
}
