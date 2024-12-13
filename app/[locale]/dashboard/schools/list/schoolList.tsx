'use client';

import { Alert, Badge, Button, Select, Table, TextInput, ToggleSwitch, Tooltip } from 'flowbite-react';
import { useLocale, useTranslations } from 'next-intl';
import { SchoolWithPrincipal } from '@/models/schools/schoolWithPrincipal';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { SchoolSwitchActivatedRequest } from '@/app/api/schools/switch-activated/route';
import { School } from '@prisma/client';
import {
  HiOutlineBuildingLibrary,
  HiOutlineDocumentText,
  HiOutlineFlag,
  HiOutlineNoSymbol,
  HiOutlineXMark
} from 'react-icons/hi2';
import { useSession } from 'next-auth/react';
import Paginator from '../../components/paginator';
import { HiOutlineFilter, HiOutlineSearch } from 'react-icons/hi';
import Link from 'next/link';
import { SchoolFilterParams } from './page';

export default function SchoolList({
  schools,
  total,
  page,
  pageSize,
  filterParams,
  isAdmin
}: {
  schools: SchoolWithPrincipal[];
  total: number;
  page: number;
  pageSize: number;
  filterParams: SchoolFilterParams;
  isAdmin: boolean;
}) {
  const t = useTranslations('dashboard.school.list');
  const tGeneral = useTranslations('dashboard.general');
  const router = useRouter();
  const locale = useLocale();
  const { data: session, update }: any = useSession();
  const [toggleProcessing, setToggleProcessing] = useState<boolean>(false);
  const [filters, setFilters] = useState<SchoolFilterParams>(filterParams);

  const updateActiveSchool = async (id: string, name: string) => {
    if (session) {
      const token = {
        ...session,
        user: {
          ...session.user,
          activeSchool: {
            id: id,
            schoolName: name
          }
        }
      };

      await fetch('/api/active-school/update', {
        method: 'POST',
        body: JSON.stringify({
          userId: session.user.id,
          schoolId: id
        })
      });

      await update(token);
      toast.success(t('school_selected'));
    }
  };

  const toggleActivated = async (school: SchoolWithPrincipal) => {
    setToggleProcessing(true);
    const response = await fetch('/api/schools/switch-activated', {
      method: 'POST',
      body: JSON.stringify({
        schoolId: school.id,
        locale
      } as SchoolSwitchActivatedRequest)
    });

    if (response.ok) {
      const resJson = (await response.json()) as School;
      toast.success(resJson.activatedAt !== null ? t('school_activated') : t('school_deactivated'));
      schools = schools.map((s) => {
        if (s.id == school.id) s.activatedAt = resJson.activatedAt;
        return s;
      });
    } else {
      toast.error(t('school_activation_fail'));
    }
    setToggleProcessing(false);
  };

  const buildFilterQueryString = () => {
    const queryParts = [];
    if (filters.search !== undefined) queryParts.push(`search=${filters.search}`);
    if (filters.country !== undefined) queryParts.push(`country=${filters.country}`);
    return queryParts.join('&');
  };

  const handlePageChange = (p: number) => {
    const filterQuery = buildFilterQueryString();
    const url = `/dashboard/schools/list?page=${p}&${filterQuery}`;
    router.push(url);
  };

  const handleFiltersApplied = () => {
    const filterQuery = buildFilterQueryString();
    const url = `/dashboard/schools/list?page=1&${filterQuery}`;
    router.push(url);
  };

  const handleFiltersReset = () => {
    setFilters({
      search: undefined,
      country: undefined
    });
    const url = `/dashboard/schools/list?page=1`;
    router.push(url);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <h1 className="text-xl mt-2 text-purple-600 grow font-bold dark:text-white">{t('heading')}</h1>
        <Button outline pill gradientDuoTone="purpleToBlue" onClick={() => router.push(`/dashboard/schools/register`)}>
          {t('register')}
        </Button>
      </div>
      <div className="flex sm:flex-col md:flex-row justify-between">
        <div className="flex flex-row gap-4">
          <div className="flex flex-row gap-2">
            <div>
              <TextInput
                icon={HiOutlineSearch}
                id="search"
                placeholder={t('search')}
                type="text"
                value={filters.search ?? ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            {isAdmin && (
              <div>
                <Select
                  id="country"
                  icon={HiOutlineFlag}
                  value={filters.country ?? ''}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      country: e.target.value !== '' ? parseInt(e.target.value) : undefined
                    })
                  }
                >
                  <option value={''}>{t('all_schools')}</option>
                  <option value={'0'}>{t('cz_schools')}</option>
                  <option value={'1'}>{t('sk_schools')}</option>
                </Select>
              </div>
            )}
            <div>
              <Tooltip content={tGeneral('apply_filters')}>
                <Button
                  type="submit"
                  outline
                  pill
                  gradientDuoTone="purpleToBlue"
                  onClick={() => handleFiltersApplied()}
                >
                  <HiOutlineFilter className="w-5 h-5" />
                </Button>
              </Tooltip>
            </div>

            <div>
              <Tooltip content={tGeneral('reset_filters')}>
                <Button outline pill gradientDuoTone="pinkToOrange" onClick={() => handleFiltersReset()}>
                  <HiOutlineXMark className="w-5 h-5" />
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
        <div>
          {total > pageSize && (
            <Paginator page={page} total={Math.ceil(total / pageSize)} pageChangeHandler={handlePageChange} />
          )}
        </div>
      </div>
      <div className="mt-2">
        {schools.length == 0 && (
          <Alert icon={HiOutlineNoSymbol} color="purple">
            {t(`no_schools`)}
          </Alert>
        )}

        {schools.length > 0 && (
          <Table hoverable={true} striped={true}>
            <Table.Head>
              <Table.HeadCell>{t('country')}</Table.HeadCell>
              <Table.HeadCell>{t('name')}</Table.HeadCell>
              <Table.HeadCell>{t('address')}</Table.HeadCell>
              <Table.HeadCell>{t('phone')}</Table.HeadCell>
              <Table.HeadCell>{t('email')}</Table.HeadCell>
              <Table.HeadCell>{t('business_id')}</Table.HeadCell>
              {isAdmin && (
                <Table.HeadCell>
                  <Tooltip content={t('activated_help')} placement="left" className="normal-case">
                    <span>{t('activated')}?</span>
                  </Tooltip>
                </Table.HeadCell>
              )}
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {schools.map((school) => (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={school.id}>
                  <Table.Cell>
                    <Badge color="purple" className="w-fit">
                      {(() => {
                        switch (school.country) {
                          case 0:
                            return 'CZ';
                          case 1:
                            return 'SK';
                          default:
                            return '-';
                        }
                      })()}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="font-medium">{school.schoolName}</Table.Cell>
                  <Table.Cell className="font-medium">{school.address}</Table.Cell>
                  <Table.Cell className="font-medium">
                    {school.principal?.user?.phone && (
                      <Link
                        href={`tel:${school.principal.user.phone}`}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        {school.principal?.user.phone}
                      </Link>
                    )}
                  </Table.Cell>
                  <Table.Cell className="font-medium">
                    <Link
                      href={`mailto:${school.principal?.user?.email}`}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      {school.principal?.user?.email}
                    </Link>
                  </Table.Cell>
                  <Table.Cell className="font-medium">{school.businessId}</Table.Cell>
                  {isAdmin && (
                    <Table.Cell>
                      <Tooltip content={t('toggle_activated')}>
                        <ToggleSwitch
                          color="purple"
                          label=""
                          checked={school.activatedAt !== null}
                          onChange={() => toggleActivated(school)}
                          disabled={toggleProcessing}
                        />
                      </Tooltip>
                    </Table.Cell>
                  )}
                  <Table.Cell className="float-right">
                    <div className="flex flex-row gap-2">
                      <Tooltip content={t('select_school')}>
                        <Button
                          outline
                          pill
                          gradientDuoTone="purpleToBlue"
                          onClick={() => updateActiveSchool(school.id, school.schoolName)}
                        >
                          <HiOutlineBuildingLibrary className="h-5 w-5" />
                        </Button>
                      </Tooltip>
                      <Tooltip content={t('detail')}>
                        <Button
                          outline
                          pill
                          gradientDuoTone="purpleToBlue"
                          onClick={() => router.push(`list/${school.id}`)}
                        >
                          <HiOutlineDocumentText className="h-5 w-5" />
                        </Button>
                      </Tooltip>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>
    </div>
  );
}
