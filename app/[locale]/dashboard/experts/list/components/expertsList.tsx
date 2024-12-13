'use client';

import { Button, Badge, Table, Dropdown, Alert, TextInput, Tooltip } from 'flowbite-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  HiOutlineCheckBadge,
  HiOutlineCheckCircle,
  HiOutlineNoSymbol,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineXCircle,
  HiOutlineXMark
} from 'react-icons/hi2';
import { ExpertDto } from '@/models/experts/expert.dto';
import { useConfirm } from '@/app/components/confirm/confirmProvider';
import ExpertCreateModal from './modals/expertCreateModal';
import ExpertUpdateModal from './modals/expertUpdateModal';
import { ExpertDeleteRequest } from '@/app/api/experts/delete/route';
import ExpertVerifyModal from './modals/expertVerifyModal';
import Link from 'next/link';
import { HiOutlineFilter, HiOutlineSearch } from 'react-icons/hi';
import Paginator from '../../../components/paginator';
import { ExpertFilterParams } from '../page';
import { useRouter } from 'next/navigation';

export default function ExpertsList({
  schoolId,
  expertsList,
  total,
  page,
  pageSize,
  filterParams,
  isAdmin
}: {
  schoolId: string | undefined;
  expertsList: ExpertDto[];
  total: number;
  page: number;
  pageSize: number;
  filterParams: ExpertFilterParams;
  isAdmin: boolean;
}) {
  const t = useTranslations('dashboard.experts.list');
  const tGeneral = useTranslations('dashboard.general');
  const [selectedExpert, setSelectedExpert] = useState<ExpertDto | null>(null);
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openVerifyModal, setOpenVerifyModal] = useState<boolean>(false);
  const [filters, setFilters] = useState<ExpertFilterParams>(filterParams);
  const [experts, setExperts] = useState<ExpertDto[]>(expertsList);
  const [currentPage, setCurrentPage] = useState(page);
  const [currentTotal, setCurrentTotal] = useState(total);

  const router = useRouter();
  const { showConfirm } = useConfirm();

  const reloadExperts = async (skip: number, take: number, search?: string) => {
    const params = new URLSearchParams({
      skip: skip.toString(),
      take: take.toString()
    });
    if (search) params.set('search', search);
    if (!isAdmin && schoolId) params.set('schoolId', schoolId);
    const response = await fetch('/api/experts/list?' + params);

    const result = await response.json();
    if (result) {
      setCurrentTotal(result.total);
      setExperts(result.data);
    }
  };

  const buildFilterQueryString = () => {
    const queryParts = [];
    if (filters.search !== undefined) queryParts.push(`search=${filters.search}`);
    return queryParts.join('&');
  };

  const handlePageChange = async (p: number) => {
    setCurrentPage(p);
    await reloadExperts((p - 1) * pageSize, pageSize, filters.search);
    const filterQuery = buildFilterQueryString();
    const url = `/dashboard/experts/list?page=${p}&${filterQuery}`;
    router.push(url);
  };

  const handleFiltersApplied = async () => {
    setCurrentPage(1);
    await reloadExperts(0, pageSize, filters.search);
    const filterQuery = buildFilterQueryString();
    const url = `/dashboard/experts/list?page=1&${filterQuery}`;
    router.push(url);
  };

  const handleFiltersReset = async () => {
    setFilters({
      search: undefined
    });
    setCurrentPage(1);
    await reloadExperts(0, pageSize);
    const url = `/dashboard/experts/list?page=1`;
    router.push(url);
  };

  const handleCreateExpert = () => {
    setSelectedExpert(null);
    setOpenCreateModal(true);
  };

  const handleEditExpert = (selectedExpert: ExpertDto) => {
    setSelectedExpert(selectedExpert);
    setOpenEditModal(true);
  };

  const handleVerifyExpert = (selectedExpert: ExpertDto) => {
    setSelectedExpert(selectedExpert);
    setOpenVerifyModal(true);
  };

  const handleCreateModalClose = () => {
    setSelectedExpert(null);
    setOpenCreateModal(false);
  };

  const handleEditModalClose = () => {
    setSelectedExpert(null);
    setOpenEditModal(false);
  };

  const handleVerifyModalClose = () => {
    setSelectedExpert(null);
    setOpenVerifyModal(false);
  };

  const handleCreateModalSave = async () => {
    await handleFiltersReset();
  };

  const handleExpertDataUpdated = (updatedExpert: ExpertDto) => {
    setExperts(
      experts.map((e) => {
        if (e.id == updatedExpert.id) e = updatedExpert;
        return e;
      })
    );
  };

  async function handleClickDelete(expert: ExpertDto) {
    showConfirm({
      title: t('expert_delete_title'),
      confirmMessage: t('expert_delete_message'),
      async onConfirm() {
        const response = await fetch('/api/experts/delete', {
          method: 'POST',
          body: JSON.stringify({
            id: expert.id,
            schoolId: schoolId
          } as ExpertDeleteRequest)
        });

        if (response.ok) {
          toast.success(t('expert_deleted'));
          await reloadExperts((currentPage - 1) * pageSize, pageSize, filters.search);
        } else {
          toast.error(t('expert_deleted_error'));
        }
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <h1 className="text-xl mt-2 text-purple-600 grow font-bold dark:text-white">{t('heading')}</h1>
        {schoolId && (
          <Button outline pill gradientDuoTone="purpleToBlue" onClick={() => handleCreateExpert()}>
            {t('register')}
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
        {experts.length == 0 && (
          <Alert icon={HiOutlineNoSymbol} color="purple">
            {t(`no_experts`)}
          </Alert>
        )}

        {experts.length > 0 && (
          <Table hoverable={true}>
            <Table.Head>
              <Table.HeadCell>{t('name')}</Table.HeadCell>
              <Table.HeadCell>{t('email')}</Table.HeadCell>
              <Table.HeadCell>{t('phone')}</Table.HeadCell>
              <Table.HeadCell>{t('is_verified')}</Table.HeadCell>
              <Table.HeadCell>{t('verified_at')}</Table.HeadCell>
              <Table.HeadCell>{t('authorization_number')}</Table.HeadCell>
              {isAdmin && (
                <>
                  <Table.HeadCell>{t('schools')}</Table.HeadCell>
                  <Table.HeadCell>{t('creation_date')}</Table.HeadCell>
                </>
              )}
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {experts.map((expert) => (
                <Table.Row key={expert.id} className={expert.isVerified ? 'bg-green-100' : ''}>
                  <Table.Cell className="font-medium">{expert.user.name}</Table.Cell>
                  <Table.Cell>
                    <Link
                      href={`mailto:${expert.user.email}`}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      {expert.user.email}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    {expert.user.phone && (
                      <Link
                        href={`tel:${expert.user.phone}`}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        {expert.user.phone}
                      </Link>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {expert.isVerified ? (
                      <HiOutlineCheckCircle className="w-8 h-8 text-green-500" />
                    ) : (
                      <HiOutlineXCircle className="w-8 h-8 text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell className="font-medium">
                    {expert.verifiedAt ? new Date(expert.verifiedAt).toLocaleDateString() : ''}
                  </Table.Cell>
                  <Table.Cell>
                    {expert.authorizationNumber && (
                      <Badge size="lg" className="w-fit" color="purple">
                        {expert.authorizationNumber}
                      </Badge>
                    )}
                  </Table.Cell>

                  {isAdmin && (
                    <>
                      <Table.Cell>
                        {expert.schools.length > 0 && (
                          <div className="flex flex-row gap-2">
                            {expert.schools.map((s, index) => (
                              <Badge key={index} className="w-fit" color="purple">
                                <Link href={`/dashboard/schools/list/${s.id}`}>{s.businessId}</Link>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </Table.Cell>

                      <Table.Cell className="font-medium">
                        {new Date(expert.createdAt).toLocaleDateString()}
                        <br />
                        {new Date(expert.createdAt).toLocaleTimeString()}
                      </Table.Cell>
                    </>
                  )}

                  <Table.Cell>
                    <Dropdown label={t('actions')} gradientDuoTone="purpleToBlue" outline pill>
                      {(isAdmin || (expert.schools.length == 1 && expert.schools[0].id == schoolId)) && (
                        <Dropdown.Item icon={HiOutlinePencilSquare} onClick={() => handleEditExpert(expert)}>
                          {t('edit')}
                        </Dropdown.Item>
                      )}
                      {isAdmin && (
                        <>
                          <Dropdown.Item icon={HiOutlineCheckBadge} onClick={() => handleVerifyExpert(expert)}>
                            {t('verify')}
                          </Dropdown.Item>

                          <Dropdown.Divider />
                          <Dropdown.Item
                            icon={HiOutlineTrash}
                            className="text-red-500"
                            onClick={() => handleClickDelete(expert)}
                          >
                            {t('delete')}
                          </Dropdown.Item>
                        </>
                      )}
                    </Dropdown>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>

      {openCreateModal && schoolId && (
        <ExpertCreateModal
          schoolId={schoolId}
          openModal={openCreateModal}
          onClose={handleCreateModalClose}
          onSave={handleCreateModalSave}
        />
      )}

      {openEditModal && selectedExpert && (
        <ExpertUpdateModal
          openModal={openEditModal}
          selectedExpert={selectedExpert}
          onClose={handleEditModalClose}
          onSave={handleExpertDataUpdated}
        />
      )}

      {openVerifyModal && selectedExpert && (
        <ExpertVerifyModal
          openModal={openVerifyModal}
          selectedExpert={selectedExpert}
          onClose={handleVerifyModalClose}
          onSave={handleExpertDataUpdated}
        />
      )}
    </div>
  );
}
