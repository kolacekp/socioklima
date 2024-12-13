import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import { useConfirm } from '@/app/components/confirm/confirmProvider';
import { useSession } from 'next-auth/react';
import { Button } from 'flowbite-react';
import { SchoolDetailWithUsers } from '@/models/schools/schoolDetailWithUsers';
import { RolesEnum } from '@/models/roles/roles.enum';
import { Dispatch, SetStateAction, useState } from 'react';
import SchoolEditModal, { EditSchoolFormValues } from './schoolEditModal';
import ChangeManagerModal, { ChangeManagerFormValues } from './changeManagerModal';
import { HiOutlineUser, HiOutlineTrash, HiOutlineIdentification } from 'react-icons/hi2';

export default function SchoolInfoTab({
  school,
  setSchool,
  userRoles
}: {
  school: SchoolDetailWithUsers;
  setSchool: Dispatch<SetStateAction<SchoolDetailWithUsers>>;
  userRoles: string[];
}) {
  const t = useTranslations('dashboard.school.detail.tabs.info');
  const { showConfirm } = useConfirm();
  const { data, update } = useSession();
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openChangeManagerModal, setOpenChangeManagerModal] = useState<boolean>(false);

  const isAdmin = userRoles.includes(RolesEnum.ADMINISTRATOR);
  const isManager = userRoles.includes(RolesEnum.SCHOOL_MANAGER);
  const isPrincipal = userRoles.includes(RolesEnum.PRINCIPAL);

  const openSchoolEditModal = () => {
    setOpenEditModal(true);
  };

  const updateSchool = async (values: EditSchoolFormValues) => {
    const res = await fetch('/api/schools/edit', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (res.ok) {
      setOpenEditModal(false);
      const data = await res.json();
      setSchool(data as SchoolDetailWithUsers);
      toast.success(t('update_success'));
    } else {
      toast.error(t('update_failure'));
    }
  };

  const changeManager = async (values: ChangeManagerFormValues) => {
    const res = await fetch('/api/schools/change-manager', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (res.ok) {
      setOpenChangeManagerModal(false);
      const data = await res.json();
      setSchool(data as SchoolDetailWithUsers);
      toast.success(t('change_manager_modal.success'));
    } else {
      const data = await res.json();
      if (data.message) {
        toast.error(t('change_manager_modal.' + data.message));
      } else {
        toast.error(t('change_manager_modal.failure'));
      }
    }
  };

  const handleDeleteSchoolClick = async () => {
    showConfirm({
      title: t('confirm_delete_title'),
      confirmMessage: t('confirm_delete_message'),
      async onConfirm() {
        const response = await fetch('/api/schools/delete', {
          method: 'POST',
          body: JSON.stringify({
            id: school.id
          })
        });

        if (response.ok) {
          if (data?.user.activeSchool?.id === school.id) {
            await resetActiveSchool();
          }
          toast.success(t('delete_success'));
          setTimeout(() => {
            window.location.href = '/dashboard/schools/list';
          }, 1000);
        } else {
          toast.error(t('delete_failure'));
        }
      }
    });
  };

  const resetActiveSchool = async () => {
    if (data) {
      const token = {
        ...data,
        user: {
          ...data.user,
          activeSchool: {
            id: null,
            schoolName: null
          }
        }
      };

      await fetch('/api/active-school/update', {
        method: 'POST',
        body: JSON.stringify({
          userId: data.user.id,
          schoolId: null
        })
      });

      await update(token);
    }
  };

  return (
    <>
      <div className="my-4 grid grid-cols-2 gap-8">
        <div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{t('contact_info')}</h3>
          <div className="mb-4">
            <h4 className="text-md mb-1 font-semibold text-gray-900 dark:text-white">{t('school_name')}</h4>
            <div>{school.schoolName}</div>
          </div>

          <div className="mb-4">
            <h4 className="text-md mb-1 font-semibold text-gray-900 dark:text-white">{t('address')}</h4>
            <div>{`${school.address}, ${school.zipCode} ${school.city}`}</div>
          </div>

          <div className="mb-4">
            <h4 className="text-md mb-1 font-semibold text-gray-900 dark:text-white">{t('school_type.title')}</h4>
            <div>{t('school_type.' + school.schoolType)}</div>
          </div>

          {school.website && (
            <div className="mb-4">
              <h4 className="text-md mb-1 font-semibold text-gray-900 dark:text-white">{t('website')}</h4>
              <div>
                <a
                  href={school.website.includes('http') ? school.website : `https://${school.website}`}
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  {school.website}
                </a>
              </div>
            </div>
          )}

          <div className="mb-4">
            <h4 className="text-md mb-1 font-semibold text-gray-900 dark:text-white">{t('business_id')}</h4>
            <div>{school.businessId}</div>
          </div>

          {school.taxNumber && (
            <div className="mb-4">
              <h4 className="text-md mb-1 font-semibold text-gray-900 dark:text-white">{t('tax_number')}</h4>
              <div>{school.taxNumber}</div>
            </div>
          )}
        </div>

        <div>
          <div className="mb-4">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{t('billing_info')}</h3>
            <div>
              {school.billingInfoEqual ? (
                t('billing_info_equal')
              ) : (
                <>
                  <div>{school.billingName}</div>
                  <div>{school.billingAddress}</div>
                  <div>
                    {school.billingZipCode} {school.billingCity}
                  </div>
                  <br />
                  <div>
                    {t('business_id')} {school.billingBusinessId}
                  </div>
                  {school.billingTaxNumber && (
                    <div>
                      {t('tax_number')} {school.billingTaxNumber}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <hr className="my-6 h-px border-0 bg-gray-200 dark:bg-gray-700"></hr>

          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{t('principal')}</h3>
          <div className="mb-4">
            <h4 className="text-md mb-1 font-semibold text-gray-900 dark:text-white">{t('principal_name')}</h4>
            <div>{school.principal.user.name}</div>
          </div>

          <div className="mb-4">
            <h4 className="text-md mb-1 font-semibold text-gray-900 dark:text-white">{t('phone')}</h4>
            <div>
              <a
                href={`tel:${school.principal.user.phone}`}
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                {school.principal.user.phone}
              </a>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-md mb-1 font-semibold text-gray-900 dark:text-white">{t('email')}</h4>
            <div>
              <a
                href={`mailto:${school.principal.user.email}`}
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                {school.principal.user.email}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {isAdmin && (
          <Button outline pill gradientDuoTone="purpleToBlue" onClick={openSchoolEditModal}>
            <HiOutlineIdentification className="mr-2 h-5 w-5" />
            {t('buttons.edit')}
          </Button>
        )}
        {isAdmin && (
          <Button outline pill gradientDuoTone="purpleToBlue" onClick={() => setOpenChangeManagerModal(true)}>
            <HiOutlineUser className="mr-2 h-5 w-5" />
            {t('buttons.change_manager')}
          </Button>
        )}
        {(isAdmin || isManager || isPrincipal) && (
          <Button outline pill gradientDuoTone="pinkToOrange" onClick={handleDeleteSchoolClick}>
            <HiOutlineTrash className="mr-2 h-5 w-5" />
            {t('buttons.delete')}
          </Button>
        )}
      </div>
      {openEditModal && (
        <SchoolEditModal
          openModal={openEditModal}
          setOpenModal={setOpenEditModal}
          school={school}
          onSubmit={updateSchool}
        />
      )}
      {openChangeManagerModal && (
        <ChangeManagerModal
          openModal={openChangeManagerModal}
          setOpenModal={setOpenChangeManagerModal}
          school={school}
          onSubmit={changeManager}
        />
      )}
    </>
  );
}
