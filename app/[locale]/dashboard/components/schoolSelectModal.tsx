'use client';

import { School } from '@prisma/client';
import { Button, Modal, Radio } from 'flowbite-react';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/app/components/navgiation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export default function SchoolSelectModal({
  openModal,
  setOpenModal
}: {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [schools, setSchools] = useState<School[]>([]);
  const t = useTranslations('dashboard.school_selector');
  const { data: session, update }: any = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    getSchools()
      .then((schools: any) => setSchools(schools))
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const getSchools = async () => {
    setIsLoading(true);

    const url = '/api/schools';
    const response = await fetch(url, { method: 'GET' });
    const data: { schools: School[] } = await response.json();

    setIsLoading(false);
    return data.schools;
  };

  const updateActiveSchool = async (id: string) => {
    if (session) {
      const schoolIndex = schools.findIndex((school) => school.id === id);

      const token = {
        ...session,
        user: {
          ...session.user,
          activeSchool: {
            id: schools[schoolIndex].id,
            schoolName: schools[schoolIndex].schoolName,
            country: schools[schoolIndex].country
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
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleRadioChange = async (event: any) => {
    const value = event.target.value;
    await formik.setFieldValue('schoolIndex', value);
  };

  const handleRegisterSchoolClick = () => {
    router.push('/dashboard/schools/register');
    setOpenModal(false);
  };

  const formik = useFormik({
    initialValues: {
      schoolIndex: session?.user?.activeSchool?.id || 0
    },
    onSubmit: async (values) => {
      await updateActiveSchool(values.schoolIndex);
      setOpenModal(false);
      router.push(pathname, {
        locale: session.user.activeSchool.country == 0 ? 'cs' : 'sk'
      });
    }
  });

  return (
    <Modal dismissible show={openModal} onClose={handleCloseModal}>
      <form onSubmit={formik.handleSubmit}>
        <Modal.Header>{t('school_selection')}</Modal.Header>

        <Modal.Body className="max-h-[50vh]">
          <div className="space-y-6">
            <ul className="grid w-full gap-1">
              {isLoading ? (
                <div role="status" className="animate-pulse">
                  <div className="h-24 w-full rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  <span className="sr-only">{t('loading')}</span>
                </div>
              ) : schools.length > 0 ? (
                schools.map((school) => (
                  <li key={school.id}>
                    <Radio
                      id={'school-' + school.id}
                      {...formik.getFieldProps('schoolIndex')}
                      value={school.id}
                      checked={formik.values.schoolIndex === school.id}
                      onChange={handleRadioChange}
                      className="peer hidden"
                    />
                    <label
                      htmlFor={'school-' + school.id}
                      className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 my-1
                      text-gray-600 hover:bg-gray-100 hover:text-gray-700 peer-checked:border-cyan-700 peer-checked:text-cyan-800 peer-checked:bg-cyan-50"
                    >
                      <div className="block">
                        <div className="w-full text-lg font-semibold">{school.schoolName}</div>
                        <div className="w-full">
                          {school.address}, {school.zipCode} {school.city}
                        </div>
                      </div>
                    </label>
                  </li>
                ))
              ) : (
                <div>{t('no_schools_found')}</div>
              )}
            </ul>
          </div>
        </Modal.Body>

        <Modal.Footer>
          {schools.length > 0 ? (
            <Button outline pill gradientDuoTone="purpleToBlue" type="submit">
              {t('confirm')}
            </Button>
          ) : (
            <Button outline pill gradientDuoTone="purpleToBlue" onClick={handleRegisterSchoolClick}>
              {t('create_school')}
            </Button>
          )}
          <Button outline pill gradientDuoTone="pinkToOrange" onClick={handleCloseModal}>
            {t('close')}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
