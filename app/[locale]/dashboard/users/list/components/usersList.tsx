'use client';

import { Role, User } from '@prisma/client';
import { Badge, Button, Dropdown, Select, Table, TextInput, Tooltip } from 'flowbite-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import Paginator from '../../../components/paginator';
import { useRouter } from 'next/navigation';
import { HiOutlineFilter, HiOutlineSearch } from 'react-icons/hi';
import { UserFilterParams } from '../page';
import { HiOutlineKey, HiOutlinePencilSquare, HiOutlineUserCircle, HiOutlineXMark } from 'react-icons/hi2';
import { RolesEnum } from '@/models/roles/roles.enum';
import toast from 'react-hot-toast';
import { signIn, SignInResponse } from 'next-auth/react';
import { Session } from 'next-auth';

export default function UsersList({
  usersList,
  total,
  page,
  pageSize,
  filterParams,
  session
}: {
  usersList: (User & { roles: Role[] })[];
  total: number;
  page: number;
  pageSize: number;
  filterParams: UserFilterParams;
  session: Session;
}) {
  const t = useTranslations('dashboard.users.users.list');
  const tGeneral = useTranslations('dashboard.general');
  const tRoles = useTranslations('lists.roles');
  const router = useRouter();
  const [users, setUsers] = useState<(User & { roles: Role[] })[]>(usersList);
  const [filters, setFilters] = useState<UserFilterParams>(filterParams);
  const [currentPage, setCurrentPage] = useState(page);
  const [currentTotal, setCurrentTotal] = useState(total);

  const buildFilterQueryString = () => {
    const queryParts = [];
    if (filters.search !== undefined) queryParts.push(`search=${filters.search}`);
    if (filters.role !== undefined) queryParts.push(`role=${filters.role}`);
    return queryParts.join('&');
  };

  const reloadUsers = async (skip: number, take: number, search?: string, role?: string) => {
    const params = new URLSearchParams({
      skip: skip.toString(),
      take: take.toString()
    });
    if (search) params.set('search', search);
    if (role) params.set('role', role);
    const response = await fetch('/api/users/list?' + params);

    const result = await response.json();
    if (result) {
      setCurrentTotal(result.total);
      setUsers(result.data);
    }
  };

  const handlePageChange = async (p: number) => {
    setCurrentPage(p);
    await reloadUsers((p - 1) * pageSize, pageSize, filters.search);
    const filterQuery = buildFilterQueryString();
    const url = `/dashboard/users/list?page=${p}&${filterQuery}`;
    router.push(url);
  };
  const handleFiltersApplied = async () => {
    setCurrentPage(1);
    await reloadUsers(0, pageSize, filters.search, filters.role);
    const filterQuery = buildFilterQueryString();
    const url = `/dashboard/users/list?page=1&${filterQuery}`;
    router.push(url);
  };

  const handleFiltersReset = async () => {
    setFilters({
      search: undefined,
      role: undefined
    });
    setCurrentPage(1);
    await reloadUsers(0, pageSize);
    const url = `/dashboard/users/list?page=1`;
    router.push(url);
  };

  const handleImpersonate = async (userId: string) => {
    const currentAdmin = session.user;

    const userToImpersonateResponse = await fetch(`/api/users/impersonate?userId=${userId}`, {
      method: 'GET'
    });
    const userToImpersonate = await userToImpersonateResponse.json();

    if (userToImpersonate) {
      await signIn('credentials', {
        redirect: false,
        usernameOrEmail: userToImpersonate.email ?? userToImpersonate.username,
        impersonatingAs: currentAdmin.id
      }).then(async (res: SignInResponse | undefined) => {
        if (!res) {
          toast.error(t('impersonation_failure'));
        } else {
          if (res.ok) {
            toast.success(t('impersonation_success'));
            if (res.url)
              setTimeout(() => {
                window.location.href = res.url || '';
              }, 1000);
          } else {
            toast.error(t('impersonation_failure'));
          }
        }
      });
    } else {
      toast.error(t('impersonation_failure'));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <h1 className="text-xl mt-2 text-purple-600 grow font-bold dark:text-white">{t('heading')}</h1>
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
              <Select
                id="country"
                icon={HiOutlineUserCircle}
                value={filters.role ?? ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    role: e.target.value !== '' ? e.target.value : undefined
                  })
                }
              >
                <option value={''}>{t('roles')}</option>
                <option value={RolesEnum.ADMINISTRATOR}>{tRoles(RolesEnum.ADMINISTRATOR)}</option>
                <option value={RolesEnum.SCHOOL_MANAGER}>{tRoles(RolesEnum.SCHOOL_MANAGER)}</option>
                <option value={RolesEnum.PRINCIPAL}>{tRoles(RolesEnum.PRINCIPAL)}</option>
                <option value={RolesEnum.EXPERT}>{tRoles(RolesEnum.EXPERT)}</option>
              </Select>
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
        <Table hoverable={true} striped={true}>
          <Table.Head>
            <Table.HeadCell>{t('name')}</Table.HeadCell>
            <Table.HeadCell>{t('email')}</Table.HeadCell>
            <Table.HeadCell>{t('phone')}</Table.HeadCell>
            <Table.HeadCell>{t('username')}</Table.HeadCell>
            <Table.HeadCell>{t('roles')}</Table.HeadCell>
            <Table.HeadCell>{t('created')}</Table.HeadCell>
            <Table.HeadCell>{t('actions')}</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {users.map((user) => (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={user.id}>
                <Table.Cell className="font-medium">{user.name}</Table.Cell>
                <Table.Cell>
                  {user.email && (
                    <Link
                      href={`mailto:${user.email}`}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      {user.email}
                    </Link>
                  )}
                </Table.Cell>
                <Table.Cell>
                  {user.phone && (
                    <Link
                      href={`tel:${user.phone}`}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      {user.phone}
                    </Link>
                  )}
                </Table.Cell>
                <Table.Cell>
                  {user.username && (
                    <Badge className="w-fit" size="lg" color="success">
                      {user.username}
                    </Badge>
                  )}
                </Table.Cell>
                <Table.Cell>
                  {user.roles.map((role: Role) => (
                    <Badge
                      className={`w-fit ${user.roles.length > 1 && 'mx-1 my-1'}`}
                      color="purple"
                      size="lg"
                      key={role.slug}
                    >
                      {tRoles(role.slug)}
                    </Badge>
                  ))}
                </Table.Cell>
                <Table.Cell className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                  <br />
                  {new Date(user.createdAt).toLocaleTimeString()}
                </Table.Cell>
                <Table.Cell>
                  <Dropdown label={t('actions')} gradientDuoTone="purpleToBlue" outline pill>
                    <Dropdown.Item icon={HiOutlinePencilSquare}>
                      <Link href={`/dashboard/users/${user.id}`}>{t('edit')}</Link>
                    </Dropdown.Item>
                    <Dropdown.Item icon={HiOutlineKey} onClick={() => handleImpersonate(user.id)}>
                      {t('impersonate')}
                    </Dropdown.Item>
                  </Dropdown>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
