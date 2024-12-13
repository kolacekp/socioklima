'use client';

import { Avatar, Badge, Dropdown } from 'flowbite-react';
import { signIn, SignInResponse, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { HiOutlineArrowRightOnRectangle, HiOutlineKey } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function HeaderUserDropdown({ user }: { user: any }) {
  const t = useTranslations('dashboard.user_dropdown');

  const cancelImpersonation = async () => {
    await signIn('credentials', {
      redirect: false,
      usernameOrEmail: user.impersonated.email,
      impersonationCancelling: true
    }).then(async (res: SignInResponse | undefined) => {
      if (!res) {
        toast.error(t('back_to_admin_failure'));
      } else {
        if (res.ok) {
          toast.success(t('back_to_admin_success'));
          if (res.url)
            setTimeout(() => {
              window.location.href = res.url || '';
            }, 1000);
        } else {
          toast.error(t('back_to_admin_failure'));
        }
      }
    });
  };

  return (
    <div className="me-2">
      <Dropdown
        arrowIcon={false}
        inline={true}
        label={
          <Avatar alt={user.name} rounded={true}>
            <div className="space-y-0.5">
              <div className="font-medium text-md mx-auto text-center">{user.name}</div>
              <Badge size="xs" color="purple" className="w-fit mx-auto">
                {user.email ? user.email : user.username}
              </Badge>
            </div>
          </Avatar>
        }
      >
        <Dropdown.Header>
          {user.name && <span className="block text-sm">{user.name}</span>}
          <span className="block truncate text-sm font-medium">{user.email}</span>
        </Dropdown.Header>
        <Dropdown.Item icon={HiOutlineKey} href="/dashboard/settings/change-password">
          {t('change_password')}
        </Dropdown.Item>
        <Dropdown.Divider />
        {user.impersonated && (
          <Dropdown.Item icon={HiOutlineArrowRightOnRectangle} onClick={cancelImpersonation}>
            {t('back_to_admin')}
          </Dropdown.Item>
        )}
        <Dropdown.Item icon={HiOutlineArrowRightOnRectangle} onClick={signOut}>
          {t('signout')}
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
}
