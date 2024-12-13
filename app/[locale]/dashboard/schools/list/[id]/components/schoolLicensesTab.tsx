import { License } from '@prisma/client';
import { Button, Table } from 'flowbite-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function SchoolLicensesTab({ licenses }: { licenses: License[] }) {
  const t = useTranslations('dashboard.licenses.list');
  const tLists = useTranslations('lists');
  return (
    <>
      <Table hoverable={true} className="mt-2" striped={true}>
        <Table.Head>
          <Table.HeadCell>{t('product.title')}</Table.HeadCell>
          <Table.HeadCell>{t('classes_total')}</Table.HeadCell>
          <Table.HeadCell>{t('valid_from')}</Table.HeadCell>
          <Table.HeadCell>{t('valid_until')}</Table.HeadCell>
          <Table.HeadCell>{t('status')}</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {licenses.length == 0 && (
            <Table.Row>
              <Table.Cell align="center" colSpan={5}>
                {t('no_licenses')}
              </Table.Cell>
            </Table.Row>
          )}
          {licenses.map((license) => (
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={license.id}>
              <Table.Cell>{tLists('products.' + license.product)}</Table.Cell>
              <Table.Cell>{license.classesTotal}</Table.Cell>
              <Table.Cell>{license.validFrom.toLocaleDateString('cs-CZ')}</Table.Cell>
              <Table.Cell>{license.validUntil.toLocaleDateString('cs-CZ')}</Table.Cell>
              <Table.Cell>{license.isPaid ? t('paid') : t('waiting_for_paiment')}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div className="mt-4 flex gap-2">
        <Button outline gradientDuoTone="purpleToBlue" pill>
          <Link href={`/dashboard/licenses/create`}>{t('order')}</Link>
        </Button>
      </div>
    </>
  );
}
