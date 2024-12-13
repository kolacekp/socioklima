'use client';

import { Alert, Badge, Button, Dropdown, Table, TextInput, ToggleSwitch, Tooltip } from 'flowbite-react';
import { useConfirm } from '@/app/components/confirm/confirmProvider';
import { LicenseListDto } from 'models/licenseListDto';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiOutlineNoSymbol, HiOutlineTrash, HiOutlineXCircle, HiOutlineXMark } from 'react-icons/hi2';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HiOutlineFilter, HiOutlineSearch } from 'react-icons/hi';
import Paginator from '../../../components/paginator';
import { LicenseFilterParams } from '../page';

export default function LicenseList({
  schoolId,
  availableLicenses,
  total,
  page,
  pageSize,
  filterParams,
  isAdmin
}: {
  schoolId: string | undefined;
  availableLicenses: LicenseListDto[];
  total: number;
  page: number;
  pageSize: number;
  filterParams: LicenseFilterParams;
  isAdmin: boolean;
}) {
  const [licenses, setLicenses] = useState(availableLicenses);
  const [toggleProcessing, setToggleProcessing] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [currentTotal, setCurrentTotal] = useState(total);
  const [filters, setFilters] = useState<LicenseFilterParams>(filterParams);

  const t = useTranslations('dashboard.licenses.list');
  const tGeneral = useTranslations('dashboard.general');
  const { showConfirm } = useConfirm();
  const router = useRouter();

  const reloadLicenses = async (skip: number, take: number, search?: string) => {
    const params = new URLSearchParams({
      skip: skip.toString(),
      take: take.toString()
    });
    if (search) params.set('search', search);
    if (!isAdmin && schoolId) params.set('schoolId', schoolId);
    const response = await fetch('/api/licenses/list?' + params);

    const result = await response.json();
    if (result) {
      setCurrentTotal(result.total);
      setLicenses(result.data);
    }
  };

  const buildFilterQueryString = () => {
    const queryParts = [];
    if (filters.search !== undefined) queryParts.push(`search=${filters.search}`);
    return queryParts.join('&');
  };

  const handlePageChange = async (p: number) => {
    setCurrentPage(p);
    await reloadLicenses((p - 1) * pageSize, pageSize, filters.search);
    const filterQuery = buildFilterQueryString();
    const url = `/dashboard/licenses/list?page=${p}&${filterQuery}`;
    router.push(url);
  };

  const handleFiltersApplied = async () => {
    setCurrentPage(1);
    await reloadLicenses(0, pageSize, filters.search);
    const filterQuery = buildFilterQueryString();
    const url = `/dashboard/licenses/list?page=1&${filterQuery}`;
    router.push(url);
  };

  const handleFiltersReset = async () => {
    setFilters({
      search: undefined
    });
    setCurrentPage(1);
    await reloadLicenses(0, pageSize);
    const url = `/dashboard/licenses/list?page=1`;
    router.push(url);
  };

  const togglePaid = async (id: string, value: boolean) => {
    setToggleProcessing(true);
    const response = await fetch(
      '/api/licenses/toggle-paid?' +
        new URLSearchParams({
          id: id,
          value: value.toString()
        }),
      {
        method: 'GET'
      }
    );

    if (response.ok) {
      updateIsPaid(id, value);
      toast.success(t('toggle_paid_success'));
    } else {
      toast.error(t('toggle_paid_error'));
    }
    setToggleProcessing(false);
  };

  const updateIsPaid = (id: string, newValue: boolean) => {
    setLicenses((prev) => {
      return prev.map((license) => {
        if (license.id === id) {
          return { ...license, isPaid: newValue };
        }
        return license;
      });
    });
  };

  const handleDeleteLicenseClick = async (id: string) => {
    showConfirm({
      title: t('confirm_delete_title'),
      confirmMessage: t('confirm_delete_message'),
      async onConfirm() {
        const response = await fetch('/api/licenses/delete', {
          method: 'POST',
          body: JSON.stringify({ id }),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          toast.success(t('license_deleted'));
          setLicenses((prev) => {
            return prev.filter((license) => license.id !== id);
          });
        }
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <h1 className="text-xl mt-2 text-purple-600 grow font-bold dark:text-white">{t('heading')}</h1>
        {schoolId && (
          <Button outline pill gradientDuoTone="purpleToBlue" onClick={() => router.push(`/dashboard/licenses/create`)}>
            {t('order')}
          </Button>
        )}
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
            <div>
              <Tooltip content={tGeneral('apply_filters')}>
                <Button
                  type="submit"
                  outline
                  pill
                  gradientDuoTone="purpleToBlue"
                  onClick={async () => await handleFiltersApplied()}
                >
                  <HiOutlineFilter className="w-5 h-5" />
                </Button>
              </Tooltip>
            </div>
            <div>
              <Tooltip content={tGeneral('reset_filters')}>
                <Button outline pill gradientDuoTone="pinkToOrange" onClick={async () => await handleFiltersReset()}>
                  <HiOutlineXMark className="w-5 h-5" />
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
        <div>
          {currentTotal > pageSize && (
            <Paginator
              page={currentPage}
              total={Math.ceil(currentTotal / pageSize)}
              pageChangeHandler={handlePageChange}
            />
          )}
        </div>
      </div>

      <div className="mt-2">
        {licenses.length == 0 && (
          <Alert icon={HiOutlineNoSymbol} color="purple">
            {t(`no_licenses`)}
          </Alert>
        )}

        {licenses.length > 0 && (
          <Table hoverable={true} striped={true}>
            <Table.Head>
              {isAdmin && <Table.HeadCell>{t('school')}</Table.HeadCell>}
              <Table.HeadCell>{t('invoice')}</Table.HeadCell>
              <Table.HeadCell>{t('product.title')}</Table.HeadCell>
              <Table.HeadCell>{t('classes_total')}</Table.HeadCell>
              <Table.HeadCell>{t('valid_from')}</Table.HeadCell>
              <Table.HeadCell>{t('valid_until')}</Table.HeadCell>
              <Table.HeadCell>{t('price')}</Table.HeadCell>
              <Table.HeadCell>{isAdmin ? t('paid') : t('status')}</Table.HeadCell>
              {isAdmin && <Table.HeadCell></Table.HeadCell>}
            </Table.Head>
            <Table.Body className="divide-y">
              {licenses.map((license) => (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={license.id}>
                  {isAdmin && (
                    <Table.Cell>
                      <Badge className="w-fit" color="purple">
                        {license.school.schoolName}
                      </Badge>
                    </Table.Cell>
                  )}
                  <Table.Cell>
                    {license.generateInvoice && (
                      <Link
                        href={`/documents/invoice/${license.id}`}
                        target="_blank"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {license.invoiceNumber}
                      </Link>
                    )}
                    {!license.generateInvoice && <HiOutlineXCircle className="w-8 h-8 text-red-500" />}
                  </Table.Cell>
                  <Table.Cell className="font-medium">{t('product.' + license.product)}</Table.Cell>
                  <Table.Cell className="font-medium">
                    {license.classesTotal - license.classesRemaining} / {license.classesTotal}
                  </Table.Cell>
                  <Table.Cell className="font-medium">
                    {new Date(license.validFrom).toLocaleDateString('cs-CZ')}
                  </Table.Cell>
                  <Table.Cell className="font-medium">
                    {new Date(license.validUntil).toLocaleDateString('cs-CZ')}
                  </Table.Cell>
                  <Table.Cell className="font-medium">
                    {license.price + ' ' + t('currency.' + license.school.country)}
                  </Table.Cell>
                  <Table.Cell>
                    {isAdmin ? (
                      <>
                        <Tooltip content={t('toggle_paid')}>
                          <ToggleSwitch
                            color="purple"
                            className=""
                            label=""
                            checked={license.isPaid}
                            onChange={() => togglePaid(license.id, !license.isPaid)}
                            disabled={toggleProcessing}
                          />
                        </Tooltip>
                      </>
                    ) : (
                      <span className="font-medium">{license.isPaid ? t('paid') : t('waiting_for_paiment')}</span>
                    )}
                  </Table.Cell>
                  {isAdmin && (
                    <Table.Cell className="float-right">
                      <Dropdown label={t('actions')} gradientDuoTone="purpleToBlue" outline pill>
                        <>
                          <Dropdown.Item
                            icon={HiOutlineTrash}
                            className="text-red-500"
                            onClick={() => handleDeleteLicenseClick(license.id)}
                          >
                            {t('delete')}
                          </Dropdown.Item>
                        </>
                      </Dropdown>
                    </Table.Cell>
                  )}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>
    </div>
  );
}
