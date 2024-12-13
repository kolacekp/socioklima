'use client';

import { Pagination } from 'flowbite-react';
import { useTranslations } from 'next-intl';

export default function Paginator({
  page,
  total,
  pageChangeHandler
}: {
  page: number;
  total: number;
  pageChangeHandler: (page: number) => void;
}) {
  const tGeneral = useTranslations('dashboard.general');

  return (
    <Pagination
      currentPage={page}
      nextLabel={tGeneral('next')}
      previousLabel={tGeneral('previous')}
      onPageChange={(page) => pageChangeHandler(page)}
      showIcons
      totalPages={total}
    />
  );
}
