import { useTranslations } from 'next-intl';
import { SchoolDetailWithUsers } from '@/models/schools/schoolDetailWithUsers';
import { Badge, Table } from 'flowbite-react';
import { HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';

export default function SchoolUsersTab({ school }: { school: SchoolDetailWithUsers }) {
  const t = useTranslations('dashboard.school.detail.tabs.allowed_users');

  return (
    <>
      <div className="my-4 flex flex-col gap-4">
        <div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{t('manager')}</h3>
          <div className="mb-4 flex flex-col gap-4">
            <div>
              <h4 className="text-md mb-1 font-semibold text-gray-900 dark:text-white">{t('manager_name')}</h4>
              <div>{school.contactUser.name}</div>
            </div>

            {school.contactUser.phone && (
              <div>
                <h4 className="text-md mb-1 font-semibold text-gray-900 dark:text-white">{t('phone')}</h4>
                <div>
                  <a
                    href={`tel:${school.contactUser.phone}`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    {school.contactUser.phone}
                  </a>
                </div>
              </div>
            )}

            <div>
              <h4 className="text-md mb-1 font-semibold text-gray-900 dark:text-white">{t('email')}</h4>
              <div>
                <a
                  href={`mailto:${school.contactUser.email}`}
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  {school.contactUser.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {school.experts.length > 0 && (
          <div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{t('experts')}</h3>
            </div>
            <div>
              <Table hoverable={true} className="mt-4 table-auto">
                <Table.Head>
                  <Table.HeadCell>{t('expert_name')}</Table.HeadCell>
                  <Table.HeadCell>{t('expert_email')}</Table.HeadCell>
                  <Table.HeadCell>{t('expert_phone')}</Table.HeadCell>
                  <Table.HeadCell>{t('expert_is_verified')}</Table.HeadCell>
                  <Table.HeadCell>{t('expert_verified_at')}</Table.HeadCell>
                  <Table.HeadCell>{t('expert_authorization_number')}</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {school.experts.map((expert) => (
                    <Table.Row key={expert.id} className={expert.isVerified ? 'bg-green-100' : ''}>
                      <Table.Cell className="font-medium">{expert.user.name}</Table.Cell>
                      <Table.Cell>
                        <a
                          href={`mailto:${expert.user.email}`}
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          {expert.user.email}
                        </a>
                      </Table.Cell>
                      <Table.Cell>
                        {expert.user.phone && (
                          <a
                            href={`tel:${expert.user.phone}`}
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                          >
                            {expert.user.phone}
                          </a>
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
                        {expert.verifiedAt ? expert.verifiedAt.toLocaleDateString() : ''}
                      </Table.Cell>
                      <Table.Cell>
                        {expert.authorizationNumber && (
                          <Badge size="lg" className="w-fit" color="purple">
                            {expert.authorizationNumber}
                          </Badge>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
